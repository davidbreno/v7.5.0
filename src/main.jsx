import React from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './index.css'
import App from './App'
import Entradas from './pages/Entradas'
import Peso from './pages/Peso'
import Agua from './pages/Agua'
import Ciclo from './pages/Ciclo'
import Relatorios from './pages/Relatorios'
import Saldo from './pages/Saldo'
import Settings from './pages/Settings'
;(function applyThemeOnStart(){ try{ const t = localStorage.getItem('dashboard:theme') || 'default'; const b=document.body; b.className=b.className.replace(/(^|\s)theme-\w+\b/g,'').trim(); if(t!=='default') b.classList.add(`theme-${t}`) }catch{}})()
const router=createBrowserRouter([{path:'/',element:<App/>},{path:'/entradas',element:<Entradas/>},{path:'/peso',element:<Peso/>},{path:'/agua',element:<Agua/>},{path:'/ciclo',element:<Ciclo/>},{path:'/relatorios',element:<Relatorios/>},{path:'/saldo',element:<Saldo/>},{path:'/config',element:<Settings/>}])
createRoot(document.getElementById('root')).render(<React.StrictMode><RouterProvider router={router} /></React.StrictMode>)