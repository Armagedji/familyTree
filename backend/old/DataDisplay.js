import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './DataDisplay.css'; // стилизация компонента

function DataDisplay() {
    // Состояние для хранения данных из базы
    const [personData, setPersonData] = useState({});
    // Состояние для сообщений об ошибке
    const [errorMessage, setErrorMessage] = useState('');

    // Загрузка данных из базы при загрузке компонента
    useEffect(() => {
        fetchData();
    }, []);

    // Функция для загрузки данных из базы
    const fetchData = async () => {
        try {
            const response = await axios.get('http://127.0.0.1:5000/api/getperson/3'); // замените на свой URL и id персоны
            console.log("Данные: ", response.data);
            setPersonData(response.data);
        } catch (error) {
            console.error('Ошибка при загрузке данных:', error);
            setErrorMessage('Ошибка при загрузке данных');
        }
    };

    return (
        <div className="data-display-container">
            <div className="data-container">
                <h2>Данные персоны:</h2>
                <ul>
                    <li><strong>Фамилия:</strong> {personData.surname}</li>
                    <li><strong>Имя:</strong> {personData.first_name}</li>
                    <li><strong>Отчество:</strong> {personData.patronymic}</li>
                    <li><strong>Пол:</strong> {personData.sex == 0 ? 'Мужской' : "Женский"}</li>
                    <li><strong>Дата рождения:</strong> {personData.birth_date}</li>
                    <li><strong>Страна рождения:</strong> {personData.birth_country}</li>
                    <li><strong>Город рождения:</strong> {personData.birth_city}</li>
                    <li><strong>Улица рождения:</strong> {personData.birth_street}</li>
                    <li><strong>Дом рождения:</strong> {personData.birth_house}</li>
                    <li><strong>Квартира рождения:</strong> {personData.birth_apartment}</li>
                    <li><strong>Дата смерти:</strong> {personData.death_date}</li>
                    <li><strong>Страна смерти:</strong> {personData.death_country}</li>
                    <li><strong>Город смерти:</strong> {personData.death_city}</li>
                    <li><strong>Национальность:</strong> {personData.nationality}</li>
                    <li><strong>Социальный статус:</strong> {personData.social_status}</li>
                    <li><strong>Источник информации:</strong> {personData.information_source}</li>
                    <li><strong>Подробности жизни:</strong> {personData.life_details}</li>
                    <li><strong>Основной контакт:</strong> {personData.is_primary_contact ? 'Да' : 'Нет'}</li>
                </ul>
            </div>

            <div className="data-container">
            <h2>Работы:</h2>
                <ul>
                    {personData['professions'] && personData['professions'].map((job, index) => (
                        <li key={index}>{job}</li>
                    ))}
                </ul>
            </div>

            <div className="data-container">
                <h2>Образование:</h2>
                <ul>
                    {personData['educations'] && personData['educations'].map((edu, index) => (
                        <li key={index}>{edu}</li>
                    ))}
                </ul>
            </div>

            <div className="data-container">
                <h2>Места жительства:</h2>
                <ul>
                    {personData['residences'] && personData['residences'].map((residence, index) => (
                        <li key={index}>
                            <strong>Страна:</strong> {residence.country}, <strong>Город:</strong> {residence.city}, <strong>Улица:</strong> {residence.street}, <strong>Дом:</strong> {residence.house}, <strong>Квартира:</strong> {residence.apartment}, <strong>Начало
                            жилья:</strong> {residence.start_date}, <strong>Конец жилья:</strong> {residence.end_date}
                        </li>
                    ))}
                </ul>
            </div>

            {errorMessage && <p className="error-message">{errorMessage}</p>}
        </div>
    );
}

export default DataDisplay;
