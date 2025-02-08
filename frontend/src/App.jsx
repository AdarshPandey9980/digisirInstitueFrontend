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
import TeacherRegisterForm from './teachers/TeacherRegister'
import TeacherLogin from './teachers/TeacherLogin'
import TeacherDashboard from './teachers/TeacherDashboard'
import ParentRegisterForm from './parents/ParentRegister'
import ParentLogin from './parents/ParentLogin'
import ParentDashboard from './parents/ParentDashboard'
import SuperAdminRegister from './superAdmins/SuperAdminRegister'
import SuperAdminLogin from './superAdmins/superAdminLogin'
import SuperAdminDashboard from './superAdmins/superAdminDashboard'
import InstituteDetail from './superAdmins/InstituteDetails'
function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path='/institute/:id' element={<InstituteDetail/>}/>
          <Route path="/superadmin-register" element={<SuperAdminRegister/>} />
          <Route path="/superadmin-login" element={<SuperAdminLogin/>} />
          <Route path="/superadmin-dashboard" element={<SuperAdminDashboard/>} />
          <Route path='/institute-register' element={<InstituteForm/>}/>
          <Route path='/institute-login' element={<InstituteLogin/> }/>
          <Route path='/institute-dashboard' element={<InstituteDashboard/> }/>
          <Route path='/student-register' element={<StudentRegisterForm/>}/>
          <Route path='/student-login' element={<StudentLogin/>}/>
          <Route path='/student-dashboard' element={<StudentDashboard/>}/>
          <Route path='/teacher-register' element={<TeacherRegisterForm/>}/>
          <Route path='/teacher-login' element={<TeacherLogin/>}/>
          <Route path='/teacher-dashboard' element={<TeacherDashboard/>}/>
          <Route path='/parent-register' element={<ParentRegisterForm/>}/>
          <Route path='/parent-login' element={<ParentLogin/>}/>
          <Route path='/parent-dashboard' element={<ParentDashboard/>}/>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
