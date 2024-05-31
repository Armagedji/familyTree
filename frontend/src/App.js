import './App.css';
import React, {useState} from 'react';
import axios from "axios";
import {Routes, Route, Navigate, useNavigate} from "react-router-dom";
import RegistrationForm from "./components/RegistrationForm";
import LoginForm from "./components/LoginForm";
import DefaultLayout from "./components/DefaultLayout";
import {Navbar} from "reactstrap";


function App() {
    const navigate = useNavigate();
    const [userId, setUserId] = useState(localStorage.getItem('userId'));
    const [persons, setPersons] = useState(JSON.parse(localStorage.getItem('persons')));

    const handleLogin = async (userData) => {
        localStorage.setItem('userId', userData.user_id);
        localStorage.setItem('username', userData.user_login);
        setUserId(userData.user_id); // Обновляем user_id при успешном входе
        const result = await axios.get(`http://127.0.0.1:5000/api/getpersons/${userId}`);
        setPersons(result.data);
        localStorage.setItem('persons', JSON.stringify(result.data));
        navigate('/familytree');
    };


    const handleLogout = () => {
        localStorage.removeItem('userId'); // Удаляем user_id из localStorage
        localStorage.removeItem('persons');
        localStorage.removeItem('username');
        window.location.reload(); // Перезагружаем страницу
    };

    return (
      <div>
          <Navbar color="" dark="true">
              <h3>FamilyTree</h3>
              {localStorage.getItem('username') ? <h5 id="greetings"> Здравствуйте, {localStorage.getItem('username')}!</h5> : ""}
              <button onClick={handleLogout}>Выход из аккаунта</button>
          </Navbar>
          <Routes>
              <Route path="/" element={userId ? <Navigate to='/familytree' replace/> : <Navigate to="/login" replace />}/>
          <Route path="/login" element={<LoginForm userData={handleLogin}/>} />
          <Route path="/register" element={<RegistrationForm userData={handleLogin}/>} />
          <Route path="/familytree" element={userId ? <DefaultLayout /> : <Navigate to='/login' replace/>} />
        </Routes>
      </div>
  );
}

export default App;