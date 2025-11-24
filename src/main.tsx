import { createRoot } from 'react-dom/client'
import './index.css'
import { router } from './App.tsx'
import { RouterProvider } from 'react-router'
import AuthProvider from './contexts/AuthContext.tsx'

createRoot(document.getElementById('root')!).render(
    <AuthProvider>
        <RouterProvider router={router}/>
    </AuthProvider>
)
