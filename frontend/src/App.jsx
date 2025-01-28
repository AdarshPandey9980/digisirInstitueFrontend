import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import InstituteForm from './institutes/InstitueSetup'
import InstituteLogin from './institutes/InstituteLogin'
import InstituteDashboard from './institutes/InstituteDashboard'
import StudentRegisterForm from './students/StudentRegister'
import StudentLogin from './students/StudentLogin'
import StudentDashboard from './students/StudentDashboard'
function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path='/institute-register' element={<InstituteForm/>}/>
          <Route path='/institute-login' element={<InstituteLogin/> }/>
          <Route path='/institute-dashboard' element={<InstituteDashboard/> }/>
          <Route path='/student-register' element={<StudentRegisterForm/>}/>
          <Route path='/student-login' element={<StudentLogin/>}/>
          <Route path='/student-dashboard' element={<StudentDashboard/>}/>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
