import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import './index.css'

// Activar esto si se desea ver las páginas de admin sin pasar por login
// import Admin from './pages/Admin'; 
// ReactDOM.createRoot(document.getElementById("root")).render(
//   <Admin />
// )

//import Vendor from './pages/Vendor'
 //ReactDOM.createRoot(document.getElementById("root")).render(
   //<Vendor />
 //)

 ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
)
