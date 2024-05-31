import React, {useState} from 'react';
import axios from 'axios';
import {Button, Form, FormFeedback, FormGroup, Input, Label} from "reactstrap";
import {Link, Navigate, useNavigate} from "react-router-dom";

function RegistrationForm({user_id}) {
    const navigate = useNavigate();
    const [errorMessage, setErrorMessage] = useState(null);
    const [user, setUser] = useState({
        username: '',
        password: '',
        email: '',
    });


    const handleChange = (e) => {
        const {name, value} = e.target;
        setUser({
            ...user,
            [name]: value,
        });
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        axios.post('http://127.0.0.1:5000/api/register', {
            username: user.username,
            password: user.password,
            email: user.email
        })
            .then((response) => {
                user_id(response.data.user_id);
                setErrorMessage(null);
            })
            .catch((error) => {
                console.log(error)
                setErrorMessage(error.response.data.message);
            });
    };


    return (
        <div className='selected'>
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
                <Button>Зарегистрироваться</Button>
            </Form><br/>
            <Button onClick={() => {navigate('/login');}}>Вход</Button>
        </div>
    );
}


export default RegistrationForm;
