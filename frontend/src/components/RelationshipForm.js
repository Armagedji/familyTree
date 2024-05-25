import React, { useState, useEffect } from 'react';
import axios from 'axios';

function RelationshipsForm() {
    const [people, setPeople] = useState([]);
    const [selectedPerson1, setSelectedPerson1] = useState('');
    const [selectedPerson2, setSelectedPerson2] = useState('');
    const [relationship, setRelationship] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    // Загрузка данных о людях для выбора
    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const response = await axios.get('http://127.0.0.1:5000/api/getperson'); // замените на свой URL для загрузки людей
            setPeople(response.data);
        } catch (error) {
            console.error('Ошибка при загрузке данных:', error);
            setErrorMessage('Ошибка при загрузке данных');
        }
    };

    // Функция для отправки запроса на установку связи
    const handleRelationshipSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://127.0.0.1:5000/api/setrelationship', {
                person1: selectedPerson1,
                person2: selectedPerson2,
                relationship: relationship
            });

            setSuccessMessage('Связь успешно установлена!');
            setSelectedPerson1('');
            setSelectedPerson2('');
            setRelationship('');
        } catch (error) {
            console.error('Ошибка при установке связи:', error);
            setErrorMessage('Ошибка при установке связи');
        }
    };

    return (
        <div>
            <h2>Установка связи между людьми</h2>
            <form onSubmit={handleRelationshipSubmit}>
                <div>
                    <label>Выберите первого человека:</label>
                    <select value={selectedPerson1} onChange={(e) => setSelectedPerson1(e.target.value)} required>
                        <option value="">Выберите человека</option>
                        {people.map(person => (
                            <option key={person.person_id} value={person.person_id}>
                                {person.surname} {person.first_name} {person.patronymic}
                            </option>
                        ))}
                    </select>
                </div>
                <div>
                    <label>Выберите второго человека:</label>
                    <select value={selectedPerson2} onChange={(e) => setSelectedPerson2(e.target.value)} required>
                        <option value="">Выберите человека</option>
                        {people.map(person => (
                            <option key={person.person_id} value={person.person_id}>
                                {person.surname} {person.first_name} {person.patronymic}
                            </option>
                        ))}
                    </select>
                </div>
                <div>
                    <label>Выберите тип связи:</label>
                    <select value={relationship} onChange={(e) => setRelationship(e.target.value)} required>
                        <option value="">Выберите тип связи</option>
                        <option value="1">Муж/Жена</option>
                        <option value="2">Брат/Сестра</option>
                        <option value="3">Сын/Дочь</option>
                        <option value="4">Внук/Внучка</option>
                        <option value="5">Правнук/Правнучка</option>
                        <option value="6">Отец/Мать</option>
                        <option value="7">Дедушка/Бабушка</option>
                        <option value="8">Прадедушка/Прабабушка</option>
                        <option value="9">Дальний родственник</option>
                    </select>
                </div>
                <button type="submit">Установить связь</button>
            </form>
            {errorMessage && <p style={{color: 'red'}}>{errorMessage}</p>}
            {successMessage && <p style={{color: 'green'}}>{successMessage}</p>}
        </div>
    );
}

export default RelationshipsForm;
