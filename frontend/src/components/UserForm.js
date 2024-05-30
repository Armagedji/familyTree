import React, {useState} from 'react';
import axios from 'axios';

function UserForm() {
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
        axios.post('http://127.0.0.1:5000/setuser', {
            username: user.username,
            password: user.password,
            email: user.email
        })
            .then((e) => {
                console.log(e)
            })
            .catch((err) => {
                console.log(err.response);
            });
    };


    return (
        <div>
        <h2>Регистрация</h2>
        <form onSubmit={handleSubmit}>
            <label> Логин: <input type="text" name="username" value={user.username} onChange={handleChange}/></label>
            <br/>
            <label> Пароль: <input type="password" name="password" value={user.password} onChange={handleChange}/></label>
            <br/>
            <label> Почта: <input type="email" name="email" value={user.email} onChange={handleChange}/></label>
            <br/>
            <input type="submit" value="Зарегистрироваться"/>
        </form>
    </div>
    );
}


export default UserForm;
