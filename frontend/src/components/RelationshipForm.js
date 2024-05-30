import React, { useState, useEffect } from 'react';
import axios from 'axios';

function RelationshipsForm(props) {
    const [people, setPeople] = useState('');
    const [selectedPerson1, setSelectedPerson1] = useState('');
    const [selectedPerson2, setSelectedPerson2] = useState('');
    const [relationship, setRelationship] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    // Загрузка данных о людях для выбора
    useEffect(() => {
        setPeople(props.persons)
        console.log(props.persons);
    }, []);


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

    if (people) {
        return (
            <div>
                <h2>Установка связи между людьми</h2>
                <form onSubmit={handleRelationshipSubmit}>
                    <div>
                        <label>Выберите первого человека:</label>
                        <select value={selectedPerson1} onChange={(e) => setSelectedPerson1(e.target.value)} required>
                            <option value="">Выберите человека</option>
                            {people.map(person => (
                                <option key={person['person_id']} value={person['person_id']}>
                                    {person['surname']} {person['first_name']} {person['patronymic']}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label>Выберите второго человека:</label>
                        <select value={selectedPerson2} onChange={(e) => setSelectedPerson2(e.target.value)} required>
                            <option value="">Выберите человека</option>
                            {people.map(person => (
                                <option key={person['person_id']} value={person['person_id']}>
                                    {person['surname']} {person['first_name']} {person['patronymic']}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label>Выберите тип связи:</label>
                        <select value={relationship} onChange={(e) => setRelationship(e.target.value)} required>
                            <option value="">Выберите тип связи</option>
                            <option value="spouce">Муж/Жена</option>
                            <option value="siblings">Брат/Сестра</option>
                            <option value="parent-child">Отец/Мать</option>
                        </select>
                    </div>
                    <button type="submit">Установить связь</button>
                </form>
                {errorMessage && <p style={{color: 'red'}}>{errorMessage}</p>}
                {successMessage && <p style={{color: 'green'}}>{successMessage}</p>}
            </div>
        );
    }
    else {
        return <div>Данные не были получены!</div>
    }
}

export default RelationshipsForm;
