import './App.css';
import React, {useRef, useState, useEffect} from 'react';
import axios from "axios";
import PersonInfo from "./components/PersonInfo";
import UserForm from "./components/UserForm";
import DataDisplay from "./components/DataDisplay";
import RelationshipForm from "./components/RelationshipForm";
import LoginForm from "./components/LoginForm";
import TableForm from "./components/TableForm";


function App() {
    const [userId, setUserId] = useState(localStorage.getItem('userId'));
    const [persons, setPersons] = useState(JSON.parse(localStorage.getItem('persons')));

    const handleLogin = async (userId) => {
        localStorage.setItem('userId', userId);
        setUserId(userId); // Обновляем user_id при успешном входе
        const result = await axios.get(`http://127.0.0.1:5000/api/getpersons/${userId}`);
        console.log(result);
        setPersons(result.data);
        localStorage.setItem('persons', JSON.stringify(result.data));
    };

    const handleLogout = () => {
        localStorage.removeItem('userId'); // Удаляем user_id из localStorage
        localStorage.removeItem('persons');
        window.location.reload(); // Перезагружаем страницу
    };

    return (
        <div className="App">
            {!userId ? (<div>
                <UserForm/>
                <LoginForm user_id={handleLogin} />
                </div>
            ) : (
                <div>
                    <h1>Добро пожаловать!</h1>
                    <p>Ваш user_id: {userId}</p>
                    <button onClick={handleLogout}>Logout</button>
                    <div align="center" className="three">
                        <h3>Регистрация человека</h3>
                        <PersonInfo user_id={userId}/>
                    </div>
                    <div className="four">
                        {<DataDisplay user_id={userId}/>}
                        {persons ?
                            <RelationshipForm user_id={userId} persons={persons}/>
                            : <div> Данные еще не были получены </div>
                        }
                    </div>
                    <div>
                        <TableForm />
                    </div>
                    <button onClick={() => {console.log(persons, localStorage.getItem('persons'))}}>PERSONS</button>
                </div>
            )}
        </div>

    );
}

export default App;