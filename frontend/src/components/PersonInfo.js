import React from "react";
import {Button} from "reactstrap";


function PersonInfo(props) {
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
            <p>Дата рождения: {`${personData.birth_date} ${personData.birth_date_approx ? '(приблизительно)' : ""}`}</p>
            <p>Место
                рождения: {personData.person_id ? `${personData.birth_country}, город ${personData.birth_city}, улица ${personData.birth_street}
            , дом ${personData.birth_house}, квартира ${personData.birth_apartment}` : ""}</p>
            {(personData.death_date !== '') ? (<p>Дата смерти:
                ${personData.death_date} ${personData.death_date_approx ? '(приблизительно)' : ""} </p>) : ''}
            {personData.person_id && (personData.death_country !== '' || personData.death_city !== '') ?
                <p>Место смерти: `${personData.death_country},
                    город ${personData.death_city}` </p> : ""}
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
            <p>Национальность: {personData.nationality}</p>
            <p>Социальный статус: {personData.social_status}</p>
            <p>Метод полученной информации: {personData.information_source}</p>
            <p>Детали из жизни: {personData.life_details}</p>
            {personData.user_id ? <Button style={{backgroundColor: '#0353a4'}}
                                          onClick={() => handleEditClick(personData)}>Редактировать</Button> : ''}
        </div>
    );
}

export default PersonInfo;