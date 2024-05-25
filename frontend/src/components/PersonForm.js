import React, { useState } from 'react';
import axios from 'axios';

function PersonForm({ initialPerson, onCancel, onUpdateSuccess }) {
    const [person, setPerson] = useState(initialPerson);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setPerson({
            ...person,
            [name]: type === 'checkbox' ? checked : value === "" ? null : value
        });
    };

    const handleProfessionChange = (e, index) => {
        const newProfessions = [...person.professions];
        newProfessions[index] = {
            ...newProfessions[index],
            name: e.target.value
        };
        setPerson({
            ...person,
            professions: newProfessions
        });
    };

    const addProfession = () => {
        setPerson({
            ...person,
            professions: [...person.professions, { id: Date.now().toString(), name: '' }]
        });
    };

    const removeProfession = (index) => {
        const newProfessions = [...person.professions];
        newProfessions.splice(index, 1);
        setPerson({
            ...person,
            professions: newProfessions
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        axios.post('http://127.0.0.1:5000/api/setperson', person)
            .then(response => {
                console.log('Person updated:', response.data);
                // Обновляем данные в DataDisplay
                onUpdateSuccess(response.data); // Передаем обновленные данные
            })
            .catch(error => {
                console.error('There was an error updating the person!', error);
            });
    };

    return (
        <form onSubmit={handleSubmit}>
            <input type="text" name="surname" value={person.surname} onChange={handleChange} placeholder="Фамилия" required/><br/>
            <input type="text" name="maiden_name" value={person.maiden_name} onChange={handleChange} placeholder="Фамилия до замужества"/><br/>
            <input type="text" name="first_name" value={person.first_name} onChange={handleChange} placeholder="Имя" required/><br/>
            <input type="text" name="patronymic" value={person.patronymic} onChange={handleChange} placeholder="Отчество"/><br/>
            Дата рождения
            <input type="date" name="birth_date" value={person.birth_date} onChange={handleChange} placeholder="Дата рождения"/><br/>
            <input type="checkbox" name="birth_date_approx" checked={person.birth_date_approx} onChange={handleChange}/> Дата приблизительная<br/>
            <input type="text" name="birth_country" value={person.birth_country} onChange={handleChange} placeholder="Страна рождения"/><br/>
            <input type="text" name="birth_city" value={person.birth_city} onChange={handleChange} placeholder="Город рождения"/><br/>
            <input type="text" name="birth_street" value={person.birth_street} onChange={handleChange} placeholder="Улица рождения"/><br/>
            <input type="text" name="birth_house" value={person.birth_house} onChange={handleChange} placeholder="Дом рождения"/><br/>
            <input type="text" name="birth_apartment" value={person.birth_apartment} onChange={handleChange} placeholder="Квартира рождения"/><br/>
            Дата смерти
            <input type="date" name="death_date" value={person.death_date} onChange={handleChange} placeholder="Дата смерти"/><br/>
            <input type="checkbox" name="death_date_approx" checked={person.death_date_approx} onChange={handleChange}/> Дата смерти приблизительная<br/>
            <input type="text" name="death_country" value={person.death_country} onChange={handleChange} placeholder="Страна смерти"/><br/>
            <input type="text" name="death_city" value={person.death_city} onChange={handleChange} placeholder="Город смерти"/><br/>
            <input type="text" name="nationality" value={person.nationality} onChange={handleChange} placeholder="Национальность"/><br/>
            <input type="text" name="social_status" value={person.social_status} onChange={handleChange} placeholder="Социальный статус"/><br/>
            <input type="text" name="information_source" value={person.information_source} onChange={handleChange} placeholder="Как получены сведения"/><br/>
            <textarea name="life_details" value={person.life_details} onChange={handleChange} placeholder="Подробности жизни"/><br/>
            <input type="checkbox" name="is_primary_contact" checked={person.is_primary_contact} onChange={handleChange}/> Этот человек основной контакт<br/>

            <h3>Профессии:</h3>
            {person.professions.map((profession, index) => (
                <div key={index}>
                    <input
                        type="text"
                        value={profession.name}
                        onChange={(e) => handleProfessionChange(e, index)}
                        placeholder={`Профессия ${index + 1}`}
                    />
                    <button type="button" onClick={() => removeProfession(index)}>Удалить</button>
                </div>
            ))}
            <button type="button" onClick={addProfession}>Добавить профессию</button>

            <button type="submit">Сохранить</button>
            <button type="button" onClick={onCancel}>Отмена</button>
        </form>
    );
}

export default PersonForm;
