import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
// import { GoogleOAuthProvider } from '@react-oauth/google'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {/* <GoogleOAuthProvider clientId="152869943056-66kfsoinb9spa6vj5il5phcmu8i0nkre.apps.googleusercontent.com"> */}
      <App />
    {/* </GoogleOAuthProvider> */}
  </StrictMode>,
)
