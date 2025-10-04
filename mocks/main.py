from fastapi import FastAPI, HTTPException, Body, Query, Header, Request, status
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from typing import Optional, List, Dict
from uuid import uuid4
import hashlib
from google.oauth2 import id_token
from google.auth.transport import requests as google_requests
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# In-memory DB
users = {}
tokens = {}
projects = {}  # projectId -> {"userId":..., ...project/context data...}

# Models

class LoginPayload(BaseModel):
    email: str
    password: Optional[str]
    googleToken: Optional[str] = None

class SignupPayload(BaseModel):
    email: str
    password: str
    fullName: Optional[str]

class User(BaseModel):
    id: str
    email: str
    fullName: Optional[str]

class BrandInfo(BaseModel):
    id: str = ""   # assigned by backend
    name: str
    alternativeNames: str = ""
    description: str = ""
    country: str = ""
    websites: str = ""

class Persona(BaseModel):
    name: str
    description: str = ""
    countries: str = ""

class Competitor(BaseModel):
    name: str
    alternativeNames: str = ""
    websites: str = ""

class Topic(BaseModel):
    name: str

class ContextData(BaseModel):
    brandInfo: BrandInfo
    personas: List[Persona]
    competitors: List[Competitor]
    topics: List[Topic]

# Dashboard Models

class Platform(BaseModel):
    id: str
    logoUrl: str

class DashboardOverview(BaseModel):
    prompts: int
    responses: int
    platforms: List[Platform]

class CompetitorPresence(BaseModel):
    Key: str
    IsCompetitor: bool
    presence7Days: float
    presence4Weeks: float
    presence12Weeks: float

class PositionEntry(BaseModel):
    period: str
    top: int
    middle: int
    bottom: int
    total: int
    missing: Optional[int]

class PresenceEntry(BaseModel):
    period: str
    total_responses: int
    present_count: int
    present_percentage: float

class CitationEntry(BaseModel):
    period: str
    total_responses: int
    total_sources: int
    brand_source_count: int
    competitor_source_count: int
    third_party_sources: int
    brand_percentage: float
    competitor_percentage: float
    third_party_percentage: float

# --- Auth Helpers ---

def hash_password(password: str) -> str:
    return hashlib.sha256(password.encode()).hexdigest()

def make_token(user_id: str) -> str:
    token = str(uuid4())
    tokens[token] = user_id
    return token

def get_or_create_google_user(email: str, fullName: Optional[str]):
    for user in users.values():
        if user["email"] == email:
            return user
    uid = str(uuid4())
    user = {"id": uid, "email": email, "fullName": fullName}
    users[uid] = user
    return user

def get_userid_from_auth_header(authorization: Optional[str]) -> str:
    if not authorization or not authorization.lower().startswith("bearer "):
        raise HTTPException(status_code=401, detail="No valid Authorization header/token")
    token = authorization[7:]
    user_id = tokens.get(token)
    if not user_id:
        raise HTTPException(status_code=401, detail="Invalid or expired session token")
    return user_id

def check_project_permission(projectId: str, user_id: str):
    project = projects.get(projectId)
    if not project or project["userId"] != user_id:
        raise HTTPException(status_code=403, detail="Access denied or unknown project")
    return project

# --- Auth endpoints ---

@app.post("/api/auth/login")
async def login(payload: LoginPayload = Body(...)):    
    if payload.googleToken:
        try:
            google_user = id_token.verify_oauth2_token(
                payload.googleToken,
                google_requests.Request()
            )
            email = google_user["email"]
            full_name = google_user.get("name", None)
            user = get_or_create_google_user(email, full_name)
            return {
                "token": make_token(user["id"]),
                "user": user
            }
        except Exception:
            raise HTTPException(status_code=401, detail="Invalid Google token")

    for user in users.values():
        if user["email"] == payload.email:
            if user.get("password") == hash_password(payload.password or ""):
                return {
                    "token": make_token(user["id"]),
                    "user": user
                }
            break
    raise HTTPException(status_code=401, detail="Invalid credentials")

@app.post("/api/auth/signup")
async def signup(payload: SignupPayload = Body(...)):
    for user in users.values():
        if user["email"] == payload.email:
            raise HTTPException(status_code=400, detail="Email already registered")
    uid = str(uuid4())
    user = {
        "id": uid,
        "email": payload.email,
        "fullName": payload.fullName,
        "password": hash_password(payload.password)
    }
    users[uid] = user
    return {
        "token": make_token(uid),
        "user": user
    }

@app.post("/api/auth/logout")
async def logout(token: str = Body(...)):
    if token in tokens:
        del tokens[token]
        return {"status": "ok"}
    raise HTTPException(status_code=400, detail="Invalid token")

@app.get("/api/auth/users")
async def list_users():
    return {
        "users": list(users.values()),
        "active_sessions": list(tokens.keys()),
    }

# --- Project & Context APIs ---

@app.post("/api/context/all")
async def create_context(
    data: ContextData = Body(...), 
    authorization: Optional[str] = Header(None)
):
    user_id = get_userid_from_auth_header(authorization)
    # create new brand/project id
    project_id = str(uuid4())
    data.brandInfo.id = project_id
    # flatten context for project-centric lookup
    project_obj = {
        "id": project_id,
        "userId": user_id,
        "brandInfo": data.brandInfo.dict(),
        "personas": [p.dict() for p in data.personas],
        "competitors": [c.dict() for c in data.competitors],
        "topics": [t.dict() for t in data.topics]
    }
    projects[project_id] = project_obj
    return {"status": "success", "projectId": project_id, "brandInfo": project_obj["brandInfo"]}

@app.get("/api/context/brand/{projectId}")
async def get_brand_info(
    projectId: str, 
    authorization: Optional[str] = Header(None)
):
    user_id = get_userid_from_auth_header(authorization)
    project = check_project_permission(projectId, user_id)
    return project["brandInfo"]

@app.get("/api/context/brands")
async def get_all_user_brands(
    authorization: Optional[str] = Header(None)
):
    user_id = get_userid_from_auth_header(authorization)
    brand_list = [
        proj["brandInfo"]
        for proj in projects.values()
        if proj["userId"] == user_id
    ]
    return brand_list

@app.post("/api/context/brand")
async def create_brand_info(
    brandInfo: BrandInfo = Body(...),
    authorization: Optional[str] = Header(None)
):
    user_id = get_userid_from_auth_header(authorization)
    # Generate new project id
    project_id = str(uuid4())
    brandInfo.id = project_id
    # Create project for user, only brand info initially
    project_obj = {
        "id": project_id,
        "userId": user_id,
        "brandInfo": brandInfo.dict(),
        "personas": [],
        "competitors": [],
        "topics": [],
    }
    projects[project_id] = project_obj
    return {
        "status": "success",
        "projectId": project_id,
        "brandInfo": brandInfo.dict()
    }

@app.get("/api/context/personas/{projectId}")
async def get_personas(
    projectId: str,
    authorization: Optional[str] = Header(None)
):
    user_id = get_userid_from_auth_header(authorization)
    project = check_project_permission(projectId, user_id)
    return project["personas"]

@app.post("/api/context/personas/{projectId}")
async def save_personas(
    projectId: str, 
    personas: List[Persona] = Body(...), 
    authorization: Optional[str] = Header(None)
):
    user_id = get_userid_from_auth_header(authorization)
    project = check_project_permission(projectId, user_id)
    project["personas"] = [p.dict() for p in personas]
    return {"status": "success"}

@app.get("/api/context/competitors/{projectId}")
async def get_competitors(
    projectId: str,
    authorization: Optional[str] = Header(None)
):
    user_id = get_userid_from_auth_header(authorization)
    project = check_project_permission(projectId, user_id)
    return project["competitors"]

@app.post("/api/context/competitors/{projectId}")
async def save_competitors(
    projectId: str, 
    competitors: List[Competitor] = Body(...), 
    authorization: Optional[str] = Header(None)
):
    user_id = get_userid_from_auth_header(authorization)
    project = check_project_permission(projectId, user_id)
    project["competitors"] = [c.dict() for c in competitors]
    return {"status": "success"}

@app.get("/api/context/topics/{projectId}")
async def get_topics(
    projectId: str,
    authorization: Optional[str] = Header(None)
):
    user_id = get_userid_from_auth_header(authorization)
    project = check_project_permission(projectId, user_id)
    return project["topics"]

@app.post("/api/context/topics/{projectId}")
async def save_topics(
    projectId: str,
    topics: List[Topic] = Body(...), 
    authorization: Optional[str] = Header(None)
):
    user_id = get_userid_from_auth_header(authorization)
    project = check_project_permission(projectId, user_id)
    project["topics"] = [t.dict() for t in topics]
    return {"status": "success"}

@app.get("/api/projects/my")
async def my_projects(
    authorization: Optional[str] = Header(None)
):
    user_id = get_userid_from_auth_header(authorization)
    user_projects = [p for p in projects.values() if p["userId"] == user_id]
    return {"projects": user_projects}

# --- Dashboard Endpoints ---

@app.get("/api/dashboard-overview/{projectId}", response_model=DashboardOverview)
async def get_dashboard_overview(projectId: str, authorization: Optional[str] = Header(None)):
    user_id = get_userid_from_auth_header(authorization)
    check_project_permission(projectId, user_id)
    return DashboardOverview(
        prompts=325,
        responses=6463,
        platforms=[
            Platform(id="chat-gpt", logoUrl="https://example.com/logo1.png"),
            Platform(id="bard", logoUrl="https://example.com/logo2.png"),
        ],
    )

@app.get("/api/competitor-presence/{projectId}", response_model=List[CompetitorPresence])
async def get_competitor_presence(
    projectId: str,
    start_date: Optional[str] = Query(None, alias="start-date"),
    end_date: Optional[str] = Query(None, alias="end-date"),
    authorization: Optional[str] = Header(None),
):
    user_id = get_userid_from_auth_header(authorization)
    check_project_permission(projectId, user_id)
    return [
        CompetitorPresence(
            Key="CompetitorA",
            IsCompetitor=True,
            presence7Days=12,
            presence4Weeks=47,
            presence12Weeks=67,
        ),
        CompetitorPresence(
            Key="CompetitorB",
            IsCompetitor=True,
            presence7Days=23,
            presence4Weeks=67,
            presence12Weeks=88,
        ),
        CompetitorPresence(
            Key="CompetitorC",
            IsCompetitor=False,
            presence7Days=23,
            presence4Weeks=67,
            presence12Weeks=88,
        ),
        CompetitorPresence(
            Key="CompetitorD",
            IsCompetitor=True,
            presence7Days=23,
            presence4Weeks=67,
            presence12Weeks=88,
        ),
        CompetitorPresence(
            Key="CompetitorE",
            IsCompetitor=True,
            presence7Days=23,
            presence4Weeks=67,
            presence12Weeks=88,
        ),
    ]

@app.get("/api/position/{projectId}", response_model=List[PositionEntry])
async def get_position(projectId: str, authorization: Optional[str] = Header(None)):
    user_id = get_userid_from_auth_header(authorization)
    check_project_permission(projectId, user_id)
    return [
        PositionEntry(
                period="2025-07-01",
                top=40,
                middle=50,
                bottom=10,
                total=100,
                missing=0,
            ),
        PositionEntry(
                period="2025-09-23",
                top=49,
                middle=46,
                bottom=5,
                total=100,
                missing=0,
            )
    ]
    

@app.get("/api/presence/{projectId}", response_model=List[PresenceEntry])
async def get_presence(projectId: str, authorization: Optional[str] = Header(None)):
    user_id = get_userid_from_auth_header(authorization)
    check_project_permission(projectId, user_id)
    return [
        PresenceEntry(
            period="2025-07-30",
            total_responses=100,
            present_count=70,
            present_percentage=70,
        ),
        PresenceEntry(
            period="2025-07-30",
            total_responses=200,
            present_count=50,
            present_percentage=25,
        )
    ]

@app.get("/api/citations/{projectId}", response_model=List[CitationEntry])
async def get_citations(projectId: str, authorization: Optional[str] = Header(None)):
    user_id = get_userid_from_auth_header(authorization)
    check_project_permission(projectId, user_id)
    return [
        CitationEntry(
            period="2025-07-30",
            total_responses=140,
            total_sources=1400,
            brand_source_count=600,
            competitor_source_count=200,
            third_party_sources=600,
            brand_percentage=20,
            competitor_percentage=40,
            third_party_percentage=40,
        ),
        CitationEntry(
            period="2025-08-07",
            total_responses=140,
            total_sources=1400,
            brand_source_count=600,
            competitor_source_count=200,
            third_party_sources=600,
            brand_percentage=40,
            competitor_percentage=20,
            third_party_percentage=40,
        ),
        CitationEntry(
            period="2025-08-14",
            total_responses=140,
            total_sources=1400,
            brand_source_count=600,
            competitor_source_count=200,
            third_party_sources=600,
            brand_percentage=60,
            competitor_percentage=30,
            third_party_percentage=10,
        ),
        CitationEntry(
            period="2025-08-21",
            total_responses=140,
            total_sources=1400,
            brand_source_count=600,
            competitor_source_count=200,
            third_party_sources=600,
            brand_percentage=29,
            competitor_percentage=11,
            third_party_percentage=60,
        )
    ]

@app.get("/test")
async def get_all_test():
    return projects
