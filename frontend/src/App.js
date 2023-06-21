import './App.css';
import NavBar from './component/NavBar';
import Login from './pages/Login.js';
import ResumeUser from './pages/ResumeUser';
import Upload from './pages/Upload';
import { Routes,Route } from 'react-router-dom';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Login />} />             
        <Route path="/upload" element={<Upload/>} />
        <Route path="/resumeuser" element={<ResumeUser/>}/>
        
        
      </Routes>
      <NavBar/>
    </div>
  );
}

export default App;
