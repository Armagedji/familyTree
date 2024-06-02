import React, {useState} from 'react';
import axios from 'axios';
import "./PersonInfo.css";
import {Button, Form, Input} from "reactstrap";

function PersonRegistrationForm(props) {
    const [person, setPerson] = useState({
        user_id: props.user_id,
        surname: '',
        maiden_name: '',
        first_name: '',
        patronymic: '',
        sex: 0,
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
        const {name, value, type, checked} = e.target;
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
        const {name, value} = e.target;
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
    const handleSubmit = async (e) => {
        e.preventDefault();
        await axios.post('http://127.0.0.1:5000/api/setperson', person)
            .then(response => {
                console.log('Person added:', response.data);
                props.onCancel()
                handleUpdate();
            })
            .catch(error => {
                console.error('There was an error adding the person!', error);
            });
    };

    const handleUpdate = async (e) => {
        await axios.get(`http://127.0.0.1:5000/api/getpersons/${localStorage.getItem('userId')}`)
            .then((result) => {
                localStorage.setItem('persons', JSON.stringify(result.data))
            })
            .catch((error)=>{console.log(error)});
    }

    return (
        <div className='selected'>
            <Form id='blablabla' onSubmit={handleSubmit}>
                <h2>Регистрация человека</h2>
                <h4>Основные данные:</h4>
                <Input type="text" name="surname" value={person.surname} onChange={handleChange} placeholder="Фамилия"
                       required/><br/>
                <Input type="text" name="maiden_name" value={person.maiden_name} onChange={handleChange}
                       placeholder="Фамилия до замужества"/><br/>
                <Input type="text" name="first_name" value={person.first_name} onChange={handleChange} placeholder="Имя"
                       required/><br/>
                <Input type="text" name="patronymic" value={person.patronymic} onChange={handleChange}
                       placeholder="Отчество"/><br/>
                Пол:
                <Input type="radio" name="sex" value={0} checked={true} onChange={handleChange} required
                       defaultChecked={true}/> Мужской
                <Input type="radio" name="sex" value={1} onChange={handleChange}/> Женский <br/> <br/> <br/>
                Дата рождения
                <Input type="date" name="birth_date" value={person.birth_date} onChange={handleChange}
                       placeholder="Дата рождения"/><br/>
                <Input type="checkbox" name="birth_date_approx" checked={person.birth_date_approx}
                       onChange={handleChange}/> Дата приблизительная<br/>
                <Input type="text" name="birth_country" value={person.birth_country} onChange={handleChange}
                       placeholder="Страна рождения"/><br/>
                <Input type="text" name="birth_city" value={person.birth_city} onChange={handleChange}
                       placeholder="Город рождения"/><br/>
                <Input type="text" name="birth_street" value={person.birth_street} onChange={handleChange}
                       placeholder="Улица рождения"/><br/>
                <Input type="text" name="birth_house" value={person.birth_house} onChange={handleChange}
                       placeholder="Дом рождения"/><br/>
                <Input type="text" name="birth_apartment" value={person.birth_apartment} onChange={handleChange}
                       placeholder="Квартира рождения"/><br/>
                Дата смерти
                <Input type="date" name="death_date" value={person.death_date} onChange={handleChange}
                       placeholder="Дата смерти"/><br/>
                <Input type="checkbox" name="death_date_approx" checked={person.death_date_approx}
                       onChange={handleChange}/> Дата смерти приблизительная<br/>
                <Input type="text" name="death_country" value={person.death_country} onChange={handleChange}
                       placeholder="Страна смерти"/><br/>
                <Input type="text" name="death_city" value={person.death_city} onChange={handleChange}
                       placeholder="Город смерти"/><br/>
                <Input type="text" name="nationality" value={person.nationality} onChange={handleChange}
                       placeholder="Национальность"/><br/>
                <Input type="text" name="social_status" value={person.social_status} onChange={handleChange}
                       placeholder="Социальный статус"/><br/>
                <Input type="text" name="information_source" value={person.information_source} onChange={handleChange}
                       placeholder="Как получены сведения"/><br/>
                <Input type='textarea' name="life_details" value={person.life_details} onChange={handleChange}
                       placeholder="Подробности жизни"/><br/>
                <Input type="checkbox" name="is_primary_contact" checked={person.is_primary_contact}
                       onChange={handleChange}/> Этот человек основной контакт<br/>

                {/* Профессии */}
                <h2>Профессии:</h2>
                {person.professions.map((profession, index) => (
                    <div key={index}>
                        <Input
                            type="text"
                            value={profession}
                            onChange={(e) => handleProfessionChange(e, index)}
                            placeholder="Профессия"
                        />
                        <Button style={{backgroundColor: '#0353a4'}} type="button"
                                onClick={() => removeProfession(index)}>Удалить</Button>
                    </div>
                ))}
                <Button style={{backgroundColor: '#0353a4'}} type="button" onClick={addProfession}>Добавить
                    профессию</Button>

                {/* Образование */}
                <h2>Образование:</h2>
                {person.educations.map((profession, index) => (
                    <div key={index}>
                        <Input
                            type="text"
                            value={profession}
                            onChange={(e) => handleEducationChange(e, index)}
                            placeholder="Образование"
                        />
                        <Button style={{backgroundColor: '#0353a4'}} type="button"
                                onClick={() => removeEducation(index)}>Удалить</Button>
                    </div>
                ))}
                <Button style={{backgroundColor: '#0353a4'}} type="button" onClick={addEducation}>Добавить
                    профессию</Button>

                <h2>Места жительства:</h2>
                {person.residences.map((residence, index) => (
                    <div key={residence.id} className="residence-item">
                        <Input
                            type="text"
                            name="country"
                            value={residence.country}
                            onChange={(e) => handleResidenceChange(e, index)}
                            placeholder="Страна"
                        />
                        <Input
                            type="text"
                            name="city"
                            value={residence.city}
                            onChange={(e) => handleResidenceChange(e, index)}
                            placeholder="Город"
                        />
                        <Input
                            type="text"
                            name="street"
                            value={residence.street}
                            onChange={(e) => handleResidenceChange(e, index)}
                            placeholder="Улица"
                        />
                        <Input
                            type="text"
                            name="house"
                            value={residence.house}
                            onChange={(e) => handleResidenceChange(e, index)}
                            placeholder="Дом"
                        />
                        <Input
                            type="text"
                            name="apartment"
                            value={residence.apartment}
                            onChange={(e) => handleResidenceChange(e, index)}
                            placeholder="Квартира"
                        />
                        {/* Добавлено пояснение к полю даты начала проживания */}
                        <Input
                            type="date"
                            name="start_date"
                            value={residence.start_date}
                            onChange={(e) => handleResidenceChange(e, index)}
                            placeholder="Дата начала (гггг-мм-дд)"
                            title="Введите дату начала проживания"
                        />
                        {/* Добавлено пояснение к полю даты окончания проживания */}
                        <Input
                            type="date"
                            name="end_date"
                            value={residence.end_date}
                            onChange={(e) => handleResidenceChange(e, index)}
                            placeholder="Дата окончания (гггг-мм-дд)"
                            title="Введите дату окончания проживания. Оставьте поле пустым, если проживание продолжается"
                        />
                        <Button style={{backgroundColor: '#0353a4'}} type="button"
                                onClick={() => removeResidence(index)}>Удалить</Button>
                    </div>
                ))}
                <Button style={{backgroundColor: '#0353a4'}} type="button" onClick={addResidence}>Добавить место
                    жительства</Button><br/>
                <Button style={{backgroundColor: '#0353a4', margin: '15px'}} type="button"
                        onClick={props.onCancel}>Отмена</Button>
                <Button style={{backgroundColor: '#0353a4', margin: '15px'}} type="submit">Сохранить</Button>
            </Form>
        </div>
    );
}

export default PersonRegistrationForm;
