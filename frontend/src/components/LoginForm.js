import React, {useState} from 'react';
import axios from 'axios';
import {Button, Form, FormFeedback, FormGroup, Input, Label} from "reactstrap";
import {useNavigate} from "react-router-dom";

function LoginForm({userData}) {
    const navigate = useNavigate();
    const [credentials, setCredentials] = useState({
        usernameOrEmail: '',
        password: ''
    });
    const [errorMessage, setErrorMessage] = useState(null);

    const handleChange = (e) => {
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
        <div className='selected'>
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
            <Button> Войти </Button>
        </Form>
            <Button onClick={() => {navigate('/register');}}>Зарегистрироваться</Button>
    </div>
    );
}

export default LoginForm;
