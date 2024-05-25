import React from "react"

function PersonTable (props) {
    return (
        <table>
            <thead>
            <tr>
                <th scope="col">#</th>
                <th scope="col">Фамилия</th>
                <th scope="col">Фамилия до замужества</th>
                <th scope="col">Имя</th>
                <th scope="col">Отчество</th>
                <th scope="col">Дата рождения</th>
                <th scope="col">Дата приблизительная</th>
                <th scope="col">Страна рождения</th>
                <th scope="col">Город рождения</th>
                <th scope="col">Улица рождения</th>
                <th scope="col">Дом рождения</th>
                <th scope="col">Квартира рождения</th>
                <th scope="col">Дата смерти</th>
                <th scope="col">Дата смерти приблизительная</th>
                <th scope="col">Страна смерти</th>
                <th scope="col">Город смерти</th>
                <th scope="col">Национальность</th>
                <th scope="col">Социальный статус</th>
                <th scope="col">Как получены сведения</th>
                <th scope="col">Подробности жизни</th>
                <th scope="col">Основной контакт</th>
            </tr>
            </thead>
            <tbody>
            {props.name.map((info, index) => {

                return (
                    <tr key={index}>
                        <td>{info.surname}</td>
                        <td>{info.maiden_name}</td>
                        <td>{info.first_name}</td>
                        <td>{info.patronymic}</td>
                        <td>{info.birth_date}</td>
                        <td>{info.birth_date_approx ? 'Да' : 'Нет'}</td>
                        <td>{info.birth_country}</td>
                        <td>{info.birth_city}</td>
                        <td>{info.birth_street}</td>
                        <td>{info.birth_house}</td>
                        <td>{info.birth_apartment}</td>
                        <td>{info.death_date}</td>
                        <td>{info.death_date_approx ? 'Да' : 'Нет'}</td>
                        <td>{info.death_country}</td>
                        <td>{info.death_city}</td>
                        <td>{info.nationality}</td>
                        <td>{info.social_status}</td>
                        <td>{info.information_source}</td>
                        <td>{info.life_details}</td>
                        <td>{info.is_primary_contact ? 'Да' : 'Нет'}</td>
                    </tr>
                )
            })}
            </tbody>
        </table>
    )
}

export default PersonTable;