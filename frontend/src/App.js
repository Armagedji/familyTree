import './App.css';
import React, {useRef, useState} from 'react';
import axios from "axios";
import PersonForm from "./components/PersonForm";
import PersonInfo from "./components/PersonInfo";
import PersonTable from './components/PersonTable'
import UserForm from "./components/UserForm";
import UserTable from "./components/UserTable";
import ProfessionForm from "./components/ProfessionForm";
import DataDisplay from "./components/DataDisplay";
import RelationshipForm from "./components/RelationshipForm";
import LoginForm from "./components/LoginForm";


function App() {
    const [userId, setUserId] = useState(null);
    const [persons, setPersons] = useState(null);

    const handleLogin = async (userId) => {
        setUserId(userId); // Обновляем user_id при успешном входе
        const result = await axios.get(`http://127.0.0.1:5000/api/getpersons/${userId}`);
        setPersons(result.data);
    };

    return (
        <div className="App" align="left">
            {!userId ? (<div>
                <UserForm/>
                <LoginForm user_id={handleLogin} />
                </div>
            ) : (
                <div>
                    <h1>Добро пожаловать!</h1>
                    <p>Ваш user_id: {userId}</p>
                    <div align="center" className="three">
                        <h3>Регистрация человека</h3>
                        <PersonInfo user_id={userId}/>
                    </div>
                    <div className="four">
                        {<DataDisplay user_id={userId}/>}
                        { persons ?
                        <RelationshipForm user_id={userId} persons={persons}/>
                            : <div> Данные еще не были получены </div>
                        }
                    </div>
                </div>
            )}
        </div>

    );
}

export default App;