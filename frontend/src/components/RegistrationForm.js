import React, {useState} from 'react';
import axios from 'axios';
import {Button, Form, FormGroup, Input, Label} from "reactstrap";
import {useNavigate} from "react-router-dom";

function RegistrationForm({user_id}) {
    const navigate = useNavigate(); //Хук для перенаправления на другую страницу
    const [errorMessage, setErrorMessage] = useState(null); //Сообщение об ошибке
    const [user, setUser] = useState({ //Хук с данными из полей ввода
        username: '',
        password: '',
        email: '',
    });

    const handleChange = (e) => { //Обработчик изменений в полях ввода
        const {name, value} = e.target;
        setUser({
            ...user,
            [name]: value,
        });
    }

    const handleSubmit = (e) => { //Запрос на бэкенд для регистрации пользователя
        e.preventDefault()
        axios.post('http://127.0.0.1:5000/api/register', {
            username: user.username,
            password: user.password,
            email: user.email
        })
            .then((response) => { //Выполняется при успешном запросе
                user_id(response.data.user_id);
                setErrorMessage(null);
            })
            .catch((error) => {//Выполняется при ошибке
                console.log(error)
                setErrorMessage(error.response.data.message);
            });
    };


    return (
        <div className='selected' style={{backgroundColor: '#b9d6f2'}}>
            <Form onSubmit={handleSubmit}>
                <h2>Регистрация</h2>
                <FormGroup>
                    <Label>Логин</Label>
                    <Input type="text" name="username" value={user.username} onChange={handleChange}
                           placeholder='example'/>
                </FormGroup>
                <FormGroup>
                    <Label>Пароль</Label>
                    <Input type="password" name="password" value={user.password} onChange={handleChange}
                           placeholder='********'/>
                </FormGroup>
                <FormGroup>
                    <Label>Почта</Label>
                    <Input type="email" name="email" value={user.email} onChange={handleChange}
                           placeholder='example@gmail.com'/>
                </FormGroup>
                {errorMessage && <p className="error-message">{errorMessage}</p>}
                <Button style={{backgroundColor: '#0353a4'}}>Зарегистрироваться</Button>
            </Form><br/>
            <Button style={{backgroundColor: '#0353a4'}} onClick={() => {navigate('/login');}}>Вход</Button>
        </div>
    );
}


export default RegistrationForm;
