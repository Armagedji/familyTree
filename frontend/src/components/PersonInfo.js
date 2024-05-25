import React, { useState } from 'react';
import axios from 'axios';
import "./PersonInfo.css";

function PersonInfo(props) {
    const [person, setPerson] = useState({
        surname: '',
        maiden_name: '',
        first_name: '',
        patronymic: '',
        sex: '',
        birth_date: '',
        birth_date_approx: false,
        birth_country: '',
        birth_city: '',
        birth_street: '',
        birth_house: '',
        birth_apartment: '',
        death_date: '',
        death_date_approx: false,
        death_country: '',
        death_city: '',
        nationality: '',
        social_status: '',
        information_source: '',
        life_details: '',
        is_primary_contact: false,
        professions: [],
        educations: [],
        residences: []
    });

    // Общий обработчик изменений для полей ввода
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setPerson({
            ...person,
            [name]: type === 'checkbox' ? checked : value
        });
    };

    // Добавление профессии
    const addProfession = () => {
        setPerson({
            ...person,
            professions: [...person.professions, '']
        });
    };

    // Изменение профессии
    const handleProfessionChange = (e, index) => {
        const newProfessions = [...person.professions];
        newProfessions[index] = e.target.value;
        setPerson({
            ...person,
            professions: newProfessions
        });
    };

    // Удаление профессии
    const removeProfession = (index) => {
        const newProfessions = [...person.professions];
        newProfessions.splice(index, 1);
        setPerson({
            ...person,
            professions: newProfessions
        });
    };

    // Обработчики для образования
    const handleEducationChange = (e, index) => {
        const newProfessions = [...person.educations];
        newProfessions[index] = e.target.value;
        setPerson({
            ...person,
            educations: newProfessions
        });
    };

    // Удаление профессии
    const removeEducation = (index) => {
        const newProfessions = [...person.educations];
        newProfessions.splice(index, 1);
        setPerson({
            ...person,
            educations: newProfessions
        });
    };

    const addEducation = () => {
        setPerson({
            ...person,
            educations: [...person.educations, '']
        });
    };

    // Обработчики для мест жительства
    const handleResidenceChange = (e, index) => {
        const { name, value } = e.target;
        const newResidences = [...person.residences];
        newResidences[index] = {
            ...newResidences[index],
            [name]: value
        };
        setPerson({
            ...person,
            residences: newResidences
        });
    };

    const addResidence = () => {
        setPerson({
            ...person,
            residences: [...person.residences, {
                country: '',
                city: '',
                street: '',
                house: '',
                apartment: '',
                start_date: '',
                end_date: ''
            }]
        });
    };

    const removeResidence = (index) => {
        const newResidences = [...person.residences];
        newResidences.splice(index, 1);
        setPerson({
            ...person,
            residences: newResidences
        });
    };

    // Отправка формы
    const handleSubmit = (e) => {
        e.preventDefault();
        axios.post('http://127.0.0.1:5000/api/setperson', person)
            .then(response => {
                console.log('Person added:', response.data);
            })
            .catch(error => {
                console.error('There was an error adding the person!', error);
            });
    };

    return (
        <form onSubmit={handleSubmit}>
            {/* Основные данные */}
            <h2>Основные данные:</h2>
            <input type="text" name="surname" value={person.surname} onChange={handleChange} placeholder="Фамилия"
                   required/><br/>
            <input type="text" name="maiden_name" value={person.maiden_name} onChange={handleChange}
                   placeholder="Фамилия до замужества"/><br/>
            <input type="text" name="first_name" value={person.first_name} onChange={handleChange} placeholder="Имя"
                   required/><br/>
            <input type="text" name="patronymic" value={person.patronymic} onChange={handleChange}
                   placeholder="Отчество"/><br/>
            Пол:
            <input type="radio" name="sex" value={0} checked={true} onChange={handleChange}/> Мужской
            <input type="radio" name="sex" value={1} onChange={handleChange}/> Женский <br/> <br/> <br/>
            Дата рождения
            <input type="date" name="birth_date" value={person.birth_date} onChange={handleChange}
                   placeholder="Дата рождения"/><br/>
            <input type="checkbox" name="birth_date_approx" checked={person.birth_date_approx}
                   onChange={handleChange}/> Дата приблизительная<br/>
            <input type="text" name="birth_country" value={person.birth_country} onChange={handleChange}
                   placeholder="Страна рождения"/><br/>
            <input type="text" name="birth_city" value={person.birth_city} onChange={handleChange}
                   placeholder="Город рождения"/><br/>
            <input type="text" name="birth_street" value={person.birth_street} onChange={handleChange}
                   placeholder="Улица рождения"/><br/>
            <input type="text" name="birth_house" value={person.birth_house} onChange={handleChange}
                   placeholder="Дом рождения"/><br/>
            <input type="text" name="birth_apartment" value={person.birth_apartment} onChange={handleChange}
                   placeholder="Квартира рождения"/><br/>
            Дата смерти
            <input type="date" name="death_date" value={person.death_date} onChange={handleChange}
                   placeholder="Дата смерти"/><br/>
            <input type="checkbox" name="death_date_approx" checked={person.death_date_approx}
                   onChange={handleChange}/> Дата смерти приблизительная<br/>
            <input type="text" name="death_country" value={person.death_country} onChange={handleChange}
                   placeholder="Страна смерти"/><br/>
            <input type="text" name="death_city" value={person.death_city} onChange={handleChange}
                   placeholder="Город смерти"/><br/>
            <input type="text" name="nationality" value={person.nationality} onChange={handleChange}
                   placeholder="Национальность"/><br/>
            <input type="text" name="social_status" value={person.social_status} onChange={handleChange}
                   placeholder="Социальный статус"/><br/>
            <input type="text" name="information_source" value={person.information_source} onChange={handleChange}
                   placeholder="Как получены сведения"/><br/>
            <textarea name="life_details" value={person.life_details} onChange={handleChange}
                      placeholder="Подробности жизни"/><br/>
            <input type="checkbox" name="is_primary_contact" checked={person.is_primary_contact}
                   onChange={handleChange}/> Этот человек основной контакт<br/>

            {/* Профессии */}
            <h2>Профессии:</h2>
            {person.professions.map((profession, index) => (
                <div key={index}>
                    <input
                        type="text"
                        value={profession}
                        onChange={(e) => handleProfessionChange(e, index)}
                        placeholder="Профессия"
                    />
                    <button type="button" onClick={() => removeProfession(index)}>Удалить</button>
                </div>
            ))}
            <button type="button" onClick={addProfession}>Добавить профессию</button>

            {/* Образование */}
            <h2>Образование:</h2>
            {person.educations.map((profession, index) => (
                <div key={index}>
                    <input
                        type="text"
                        value={profession}
                        onChange={(e) => handleEducationChange(e, index)}
                        placeholder="Образование"
                    />
                    <button type="button" onClick={() => removeEducation(index)}>Удалить</button>
                </div>
            ))}
            <button type="button" onClick={addEducation}>Добавить профессию</button>

            <h2>Места жительства:</h2>
            {person.residences.map((residence, index) => (
                <div key={residence.id} className="residence-item">
                    <input
                        type="text"
                        name="country"
                        value={residence.country}
                        onChange={(e) => handleResidenceChange(e, index)}
                        placeholder="Страна"
                    />
                    <input
                        type="text"
                        name="city"
                        value={residence.city}
                        onChange={(e) => handleResidenceChange(e, index)}
                        placeholder="Город"
                    />
                    <input
                        type="text"
                        name="street"
                        value={residence.street}
                        onChange={(e) => handleResidenceChange(e, index)}
                        placeholder="Улица"
                    />
                    <input
                        type="text"
                        name="house"
                        value={residence.house}
                        onChange={(e) => handleResidenceChange(e, index)}
                        placeholder="Дом"
                    />
                    <input
                        type="text"
                        name="apartment"
                        value={residence.apartment}
                        onChange={(e) => handleResidenceChange(e, index)}
                        placeholder="Квартира"
                    />
                    {/* Добавлено пояснение к полю даты начала проживания */}
                    <input
                        type="date"
                        name="start_date"
                        value={residence.start_date}
                        onChange={(e) => handleResidenceChange(e, index)}
                        placeholder="Дата начала (гггг-мм-дд)"
                        title="Введите дату начала проживания"
                    />
                    {/* Добавлено пояснение к полю даты окончания проживания */}
                    <input
                        type="date"
                        name="end_date"
                        value={residence.end_date}
                        onChange={(e) => handleResidenceChange(e, index)}
                        placeholder="Дата окончания (гггг-мм-дд)"
                        title="Введите дату окончания проживания. Оставьте поле пустым, если проживание продолжается"
                    />
                    <button type="button" onClick={() => removeResidence(index)}>Удалить</button>
                </div>
            ))}
            <button type="button" onClick={addResidence}>Добавить место жительства</button>


            <button type="submit">Сохранить</button>
        </form>
    );
}

export default PersonInfo;
