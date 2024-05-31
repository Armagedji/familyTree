import React from "react";


function PersonInfo (props) {
    const {personData, editMode} = props;

    const handleEditClick = (personData) => {
            editMode(personData)
    }

    return (
        <div className="selected">
            <h3>Детали персоны</h3>
            <p>Фамилия: {personData.surname}</p>
            <p>Имя: {personData.first_name}</p>
            <p>Отчество: {personData.patronymic}</p>
            <p>Пол: {personData.sex === 0 ? "Мужской" : 'Женский'}</p>
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
                    <li key={index}>Страна: {residence.country} | Город: {residence.city} |
                        Адрес: {residence.street + " " + residence.house + ", " + residence.apartment + " | "}
                        Дата проживания: {residence.start_date} -- {residence.end_date}</li>
                ))}
            </ul>
            {personData.user_id ? <button onClick={() => handleEditClick(personData)}>Редактировать</button> : ''}
        </div>
    );
}

export default PersonInfo;