import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';

export interface Project {
  id: string;
  name: string;
  // Add additional fields if needed
}

interface ProjectContextType {
  currentProjectId: string | null;
  setCurrentProjectId: (id: string) => void;
  projects: Project[];
  setProjects: (items: Project[]) => void;
  getProjectById: (id: string) => Project | undefined;
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

export const ProjectProvider = ({ children }: { children: ReactNode }) => {
  const [currentProjectId, setCurrentProjectId] = useState<string | null>(() =>
    localStorage.getItem('currentProjectId')
  );
  const [projects, setProjectsState] = useState<Project[]>(() => {
    try {
      const stored = localStorage.getItem('projects');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const setCurrentId = (id: string) => {
    localStorage.setItem('currentProjectId', id);
    setCurrentProjectId(id);
  };
  const setProjects = (newProjects: Project[]) => {
    localStorage.setItem('projects', JSON.stringify(newProjects));
    setProjectsState(newProjects);
  };
  const getProjectById = (id: string) => projects.find(p => p.id === id);

  return (
    <ProjectContext.Provider value={{ currentProjectId, setCurrentProjectId: setCurrentId, projects, setProjects, getProjectById }}>
      {children}
    </ProjectContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export function useProject() {
  const context = useContext(ProjectContext);
  if (!context) {
    throw new Error('useProject must be used within ProjectProvider');
  }
  return context;
}
