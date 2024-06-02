import React, {useState} from 'react';
import axios from 'axios';
import {Button, Form, FormGroup, Input, Label} from "reactstrap";
import {useNavigate} from "react-router-dom";

function LoginForm({userData}) {
    const navigate = useNavigate(); //Хук для перенаправления на другую страницу
    const [credentials, setCredentials] = useState({
        usernameOrEmail: '',
        password: ''
    }); // Значения из полей ввода
    const [errorMessage, setErrorMessage] = useState(null); //Сообщение об ошибке

    const handleChange = (e) => { //Обработчик изменений полей ввода
        const {name, value} = e.target;
        setCredentials({
            ...credentials,
            [name]: value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        await axios.post('http://127.0.0.1:5000/api/login', credentials)
            .then((response) => {
                console.log('Успешный вход:', response.data);
                setErrorMessage(null);
                userData(response.data);
            }).catch((error) => {
                console.error('Ошибка при входе:', error);
                setErrorMessage(error.response.data.error);
            })
    };

    return (
        <div className='selected' style={{backgroundColor: '#b9d6f2'}}>
        <Form onSubmit={handleSubmit}>
            <h2>Вход</h2>
            <FormGroup controlId='formBasicLogin'>
                <Label for='usernameOrEmail'>Почта или логин</Label>
                <Input
                    type="text"
                    id="usernameOrEmail"
                    name="usernameOrEmail"
                    placeholder='Введите логин или почту'
                    value={credentials.usernameOrEmail}
                    onChange={handleChange}
                    required/>
                {errorMessage && <p className="error-message">{errorMessage}</p>}
            </FormGroup>
            <FormGroup>
                <Label for="password_input">
                    Пароль
                </Label>
                <Input
                    id="password_input"
                    name="password"
                    placeholder="************"
                    value={credentials.password}
                    onChange={handleChange}
                    type="password"
                    required
                />
            </FormGroup>
            <Button style={{backgroundColor: '#0353a4'}}> Войти </Button>
        </Form>
            <Button style={{backgroundColor: '#0353a4'}} onClick={() => {navigate('/register');}}>Зарегистрироваться</Button>
    </div>
    );
}

export default LoginForm;
