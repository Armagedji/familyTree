import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './DataDisplay.css'; // стилизация компонента

function DataDisplay() {
    const [searchQuery, setSearchQuery] = useState('');
    const [searchCategory, setSearchCategory] = useState('name'); // по умолчанию ищем по ФИО
    const [searchResults, setSearchResults] = useState([]);
    const [selectedPerson, setSelectedPerson] = useState(null);
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        // Настройка для отправки запроса поиска только при изменении searchQuery или searchCategory
        const timer = setTimeout(() => {
            if (searchQuery) {
                handleSearch();
            } else {
                setSearchResults([]);
            }
        }, 500); // Задержка для предотвращения частых запросов при вводе

        return () => clearTimeout(timer);
    }, [searchQuery, searchCategory]);

    const handleSearch = async () => {
        try {
            const response = await axios.get(`http://127.0.0.1:5000/api/search/${searchCategory}/${searchQuery}`);
            console.log("Результаты поиска: ", response.data);
            setSearchResults(response.data);
        } catch (error) {
            console.error('Ошибка при выполнении поиска:', error);
            setErrorMessage('Ошибка при выполнении поиска');
        }
    };

    const handleSelectPerson = (person) => {
        setSelectedPerson(person);
        setSearchResults([]);
    };

    const handleDeletePerson = async () => {
        try {
            await axios.delete(`http://127.0.0.1:5000/api/deleteperson/${selectedPerson.id}`);
            console.log('Человек успешно удален');
            setSelectedPerson(null);
        } catch (error) {
            console.error('Ошибка при удалении человека:', error);
            setErrorMessage('Ошибка при удалении человека');
        }
    };

    return (
        <div className="data-display-container">
            <div className="search-container">
                <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Введите запрос для поиска"
                />
                <select
                    value={searchCategory}
                    onChange={(e) => setSearchCategory(e.target.value)}
                >
                    <option value="name">ФИО</option>
                    <option value="birth_place">Место рождения</option>
                    <option value="residences">Место жительства</option>
                </select>
            </div>

            {selectedPerson && (
                <div className="data-container">
                    <h2>Данные персоны:</h2>
                    <ul>
                        <li><strong>Фамилия:</strong> {selectedPerson.surname}</li>
                        <li><strong>Имя:</strong> {selectedPerson.first_name}</li>
                        <li><strong>Отчество:</strong> {selectedPerson.patronymic}</li>
                        <li><strong>Пол:</strong> {selectedPerson.sex == 0 ? 'Мужской' : 'Женский'}</li>
                        <li><strong>Дата рождения:</strong> {selectedPerson.birth_date}</li>
                        <li><strong>Страна рождения:</strong> {selectedPerson.birth_country}</li>
                        <li><strong>Город рождения:</strong> {selectedPerson.birth_city}</li>
                        <li><strong>Улица рождения:</strong> {selectedPerson.birth_street}</li>
                        <li><strong>Дом рождения:</strong> {selectedPerson.birth_house}</li>
                        <li><strong>Квартира рождения:</strong> {selectedPerson.birth_apartment}</li>
                        <li><strong>Дата смерти:</strong> {selectedPerson.death_date}</li>
                        <li><strong>Страна смерти:</strong> {selectedPerson.death_country}</li>
                        <li><strong>Город смерти:</strong> {selectedPerson.death_city}</li>
                        <li><strong>Национальность:</strong> {selectedPerson.nationality}</li>
                        <li><strong>Социальный статус:</strong> {selectedPerson.social_status}</li>
                        <li><strong>Источник информации:</strong> {selectedPerson.information_source}</li>
                        <li><strong>Подробности жизни:</strong> {selectedPerson.life_details}</li>
                        <li><strong>Основной контакт:</strong> {selectedPerson.is_primary_contact ? 'Да' : 'Нет'}</li>
                    </ul>
                    <button onClick={handleDeletePerson}>Удалить человека</button>
                </div>
            )}

            {searchResults.length > 0 && (
                <div className="search-results-container">
                    <h2>Результаты поиска:</h2>
                    <ul>
                        {searchResults.map((person, index) => (
                            <li key={index}>
                                <button onClick={() => handleSelectPerson(person)}>Выбрать</button>{' '}
                                {person.first_name} {person.surname}, {person.birth_city}, {person.birth_country}
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {errorMessage && <p className="error-message">{errorMessage}</p>}
        </div>
    );
}

export default DataDisplay;
