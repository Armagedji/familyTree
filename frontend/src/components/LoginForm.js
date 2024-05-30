import React, { useState } from 'react';
import axios from 'axios';

function LoginForm({ user_id }) {
    const [credentials, setCredentials] = useState({
        usernameOrEmail: '',
        password: ''
    });
    const [errorMessage, setErrorMessage] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCredentials({
            ...credentials,
            [name]: value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://127.0.0.1:5000/api/login', credentials);
            console.log('Успешный вход:', response.data);
            setErrorMessage('');
            user_id(response.data.user);
            // Дополнительные действия после успешного входа можно добавить здесь
        } catch (error) {
            console.error('Ошибка при входе:', error);
            setErrorMessage('Неверные учетные данные. Попробуйте снова.');
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <h2>Вход</h2>
            {errorMessage && <p className="error-message">{errorMessage}</p>}
            <div>
                <label>Логин или Email:</label>
                <input
                    type="text"
                    name="usernameOrEmail"
                    value={credentials.usernameOrEmail}
                    onChange={handleChange}
                    required
                />
            </div>
            <div>
                <label>Пароль:</label>
                <input
                    type="password"
                    name="password"
                    value={credentials.password}
                    onChange={handleChange}
                    required
                />
            </div>
            <button type="submit">Войти</button>
        </form>
    );
}

export default LoginForm;
