import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './DataDisplay.css'; // стилизация компонента
import PersonForm from './PersonForm'; // Подключаем компонент формы редактирования

function DataDisplay() {
    const [personData, setPersonData] = useState({});
    const [errorMessage, setErrorMessage] = useState('');
    const [searchCategory, setSearchCategory] = useState('name');
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [selectedPerson, setSelectedPerson] = useState(null);
    const [editMode, setEditMode] = useState(false); // Состояние для отслеживания редактирования
    const [editPerson, setEditPerson] = useState(null); // Состояние для хранения данных редактируемой персоны

    useEffect(() => {
        if (selectedPerson) {
            console.log(selectedPerson);
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

    const handleSelectPerson = async (personId) => {
        setSelectedPerson(personId); // Устанавливаем выбранного человека
        fetchData(personId); // Загружаем данные выбранного человека
    };

    const handleEditClick = (person) => {
        setEditPerson(person);
        setEditMode(true);
    };

    const handleCancelEdit = () => {
        setEditPerson(null);
        setEditMode(false);
    };

    const handleUpdateSuccess = (updatedPerson) => {
        setPersonData(updatedPerson);
        setEditMode(false);
        setEditPerson(null);
    };

    const resetState = () => {
        setPersonData({});
        setErrorMessage('');
        setSearchResults([]);
        setSelectedPerson(null);
        setEditMode(false);
        setEditPerson(null);
    };

    return (
        <div className="data-display">
            <h2>Отображение данных</h2>
            <div className="search-section">
                <label>Категория поиска:
                    <select value={searchCategory} onChange={(e) => setSearchCategory(e.target.value)}>
                        <option value="name">ФИО</option>
                        <option value="birth_place">Место рождения</option>
                        <option value="residences">Место жительства</option>
                    </select>
                </label>
                <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Введите запрос" />
                <button onClick={handleSearch}>Поиск</button>
            </div>

            {errorMessage && <p className="error-message">{errorMessage}</p>}

            <div className="search-results">
                {searchResults.length > 0 && (
                    <ul>
                        {searchResults.map(result => (
                            <li key={result.id}>
                                <button onClick={() => handleSelectPerson(result.person_id)}>
                                    {result.surname} {result.first_name} {result.patronymic} {result.person_id}
                                </button>
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            {selectedPerson && (
                <div className="person-details">
                    <h3>Детали персоны</h3>
                    <p>Фамилия: {personData.surname}</p>
                    <p>Имя: {personData.first_name}</p>
                    <p>Отчество: {personData.patronymic}</p>
                    <p>Дата рождения: {personData.birth_date}</p>
                    <p>Страна рождения: {personData.birth_country}</p>
                    <p>Город рождения: {personData.birth_city}</p>
                    <p>Профессии:</p>
                    <ul>
                        {personData.professions && personData.professions.map((profession, index) => (
                            <li key={index}>{profession}</li>
                        ))}
                    </ul>
                    <p>Образования:</p>
                    <ul>
                        {personData.educations && personData.educations.map((education, index) => (
                            <li key={index}>{education}</li>
                        ))}
                    </ul>
                    <p>Места жительства:</p>
                    <ul>
                        {personData.residences && personData.residences.map((residence, index) => (
                            <li key={index}>Страна: {residence.country} | Город: {residence.city} | Адрес: {residence.street+" "+residence.house+", "+residence.apartment+" | "}
                                Дата проживания: {residence.start_date} -- {residence.end_date}</li>
                        ))}
                    </ul>
                    <button onClick={() => handleEditClick(personData)}>Редактировать</button>
                </div>
            )}

            {editMode && (
                <PersonForm initialPerson={editPerson} onCancel={handleCancelEdit}
                            onUpdateSuccess={handleUpdateSuccess}/>
            )}

            <button onClick={resetState}>Очистить</button>
            \
            <button onClick={() => console.log(personData)}>Инфа</button>
        </div>
    );
}

export default DataDisplay;
