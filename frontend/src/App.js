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


function App() {
    const [users, setUsers] = useState(null);
    const [persons, setPersons] = useState(null);

    const refreshUser = () => {
        axios.get('http://127.0.0.1:5000/getuser')
            .then((h) => {
                setUsers(h.data);
            })
            .catch((err) => {console.log(err)});
    }

    return (

        <div className="App" align="left">
            <div align="center" className="one">
                <h2>Регистрация</h2>
                <UserForm/>
            </div>
            <div className="two" align="center">
                <h3>Таблица пользователей</h3>
                <button onClick={refreshUser}>Обновить</button>
                {users == null ? "Без таблицы" : <UserTable name={users}/>}
            </div>
            <div align="center" className="three">
                <h3>Регистрация человека</h3>
                <PersonInfo people={persons}/>
            </div>
            {/*
                <div align="center" className="four-old">
                    <h3>Таблица зарегистрированных людей</h3>
                    <button onClick={refreshPersons}>Обновить таблицу</button>
                    {persons == null ? "Таблицы нет" : <PersonTable name={persons}/>}
                </div>*/}
            <div className="four">
                {<DataDisplay/>}
            </div>
            <div className="five">
                <RelationshipForm />
            </div>
        </div>

    );
}

export default App;