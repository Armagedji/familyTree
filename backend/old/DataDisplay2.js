import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './DataDisplay.css'; // стилизация компонента

function DataDisplay() {
    const [personData, setPersonData] = useState({});
    const [errorMessage, setErrorMessage] = useState('');
    const [searchCategory, setSearchCategory] = useState('name');
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [selectedPerson, setSelectedPerson] = useState(null);

    useEffect(() => {
        if (selectedPerson) {
            fetchData(selectedPerson);
        }
    }, [selectedPerson]);

    const fetchData = async (personId) => {
        try {
            const response = await axios.get(`http://127.0.0.1:5000/api/getperson/${personId}`);
            console.log("Данные: ", response.data);
            setPersonData(response.data);
            setSearchResults([]);
        } catch (error) {
            console.error('Ошибка при загрузке данных:', error);
            setErrorMessage('Ошибка при загрузке данных');
        }
    };

    const handleSearch = async () => {
        try {
            const response = await axios.get(`http://127.0.0.1:5000/api/search/${searchCategory}/${searchQuery}`);
            console.log("Результаты поиска: ", response.data);
            setSearchResults(response.data);
            setErrorMessage('');
        } catch (error) {
            console.error('Ошибка при выполнении поиска:', error);
            setErrorMessage('Ошибка при выполнении поиска');
            setSearchResults([]);
        }
    };

    const handleSelectPerson = (personId) => {
        setSelectedPerson(personId);
    };

    const resetState = () => {
        setPersonData({});
        setErrorMessage('');
        setSearchResults([]);
        setSelectedPerson(null);
    };

    return (
        <div className="data-display-container">
            {/* Поисковое поле */}
            <div className="search-container">
                <label htmlFor="searchCategory">Выберите категорию поиска:</label>
                <select id="searchCategory" value={searchCategory} onChange={(e) => setSearchCategory(e.target.value)}>
                    <option value="name">По ФИО</option>
                    <option value="birth_place">По месту рождения</option>
                    <option value="residences">По месту жительства</option>
                </select>
                <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Введите запрос"
                />
                <button onClick={handleSearch}>Искать</button>
                <button onClick={resetState}>Сбросить</button>
            </div>

            {/* Отображение результатов поиска */}
            {searchResults.length > 0 && (
                <div className="search-results-container">
                    <h2>Результаты поиска:</h2>
                    <ul>
                        {searchResults.map((person) => (
                            <li key={person.person_id} onClick={() => handleSelectPerson(person.person_id)}>
                                {person.surname} {person.first_name} {person.patronymic}
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {/* Отображение данных персоны */}
            {Object.keys(personData).length > 0 && (
                <div className="data-display">
                    <div className="data-container">
                        <h2>Данные персоны:</h2>
                        <ul>
                            <li><strong>Фамилия:</strong> {personData.surname}</li>
                            <li><strong>Имя:</strong> {personData.first_name}</li>
                            <li><strong>Отчество:</strong> {personData.patronymic}</li>
                            <li><strong>Пол:</strong> {personData.sex === 0 ? 'Мужской' : 'Женский'}</li>
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
                            {personData.professions && personData.professions.map((job, index) => (
                                <li key={index}>{job}</li>
                            ))}
                        </ul>
                    </div>

                    <div className="data-container">
                        <h2>Образование:</h2>
                        <ul>
                            {personData.educations && personData.educations.map((edu, index) => (
                                <li key={index}>{edu}</li>
                            ))}
                        </ul>
                    </div>

                    <div className="data-container">
                        <h2>Места жительства:</h2>
                        <ul>
                            {personData.residences && personData.residences.map((residence, index) => (
                                <li key={index}>
                                    <strong>Страна:</strong> {residence.country}, <strong>Город:</strong> {residence.city}, <strong>Улица:</strong> {residence.street}, <strong>Дом:</strong> {residence.house}, <strong>Квартира:</strong> {residence.apartment}, <strong>Начало
                                    жилья:</strong> {residence.start_date}, <strong>Конец жилья:</strong> {residence.end_date}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            )}

            {/* Отображение ошибки */}
            {errorMessage && <p className="error-message">{errorMessage}</p>}
        </div>
    );
}

export default DataDisplay;
