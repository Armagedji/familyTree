import PersonRegistrationForm from "./PersonRegistrationForm";
import DataDisplay from "./DataDisplay";
import RelationshipForm from "./RelationshipForm";
import TableForm from "./TableForm";
import React, {useState} from "react";
import {Button, Col, Container, Row} from "reactstrap";
import SearchForm from "./SearchForm";
import PersonInfo from "./PersonInfo";
import EditForm from "./EditForm";
import axios from "axios";
import './DefaultLayout.css';


function DefaultLayout() {
    const [userId, setUserId] = useState(localStorage.getItem('userId'));
    const [editPerson, setEditPerson] = useState(null);
    const [persons, setPersons] = useState(JSON.parse(localStorage.getItem('persons')));
    const [selectedPerson, setSelectedPerson] = useState({
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
    const handleLogout = () => {
        localStorage.removeItem('userId'); // Удаляем user_id из localStorage
        localStorage.removeItem('persons');
        localStorage.removeItem('username');
        window.location.reload(); // Перезагружаем страницу
    };

    const handleSearchResult = (personData) => {
        setSelectedPerson(personData);
    }

    const handleEditMode = (editPersonData) => {
        setEditPerson(editPersonData);
    }

    const handleUpdateSuccess = (updatedPerson) => {
        setEditPerson(null);
        fetchData(updatedPerson['person_id']);
    };

    const fetchData = async (personId) => {
        try {
            const response = await axios.get(`http://127.0.0.1:5000/api/getperson/${personId}`);
            console.log("Данные: ", response.data);
            setSelectedPerson(response.data);
        } catch (error) {
            console.error('Ошибка при загрузке данных:', error);
        }
    };

    const handleCancelEdit = () => {
        setEditPerson(null);
    };

    return (
        <Container fluid>
            <Row>
                <Col sm='7' >
                    <DataDisplay user_id={userId}/>
                </Col>
                <Col sm='5'>
            <SearchForm personData={handleSearchResult} user_id={userId}/>
            <PersonInfo personData={selectedPerson} editMode={handleEditMode}/>
                </Col>
            </Row>
            <Row>
                <Col>
                <TableForm/>
                </Col>
                <Col sm='3'>
                {persons ?
                    <RelationshipForm user_id={userId} persons={persons}/>
                    : <div> Данные еще не были получены </div>
                }
                </Col>
                <Col sm='3'>
                    <Button>Добавить нового человека</Button>
                </Col>
            </Row>
            {editPerson ?
                <EditForm id="blablabla" initialPerson={editPerson} onCancel={handleCancelEdit}
                          onUpdateSuccess={handleUpdateSuccess}/> : "Тут ничего нет!"}
            <div align="center" className="three">
                <h3>Регистрация человека</h3>
                <PersonRegistrationForm user_id={userId}/>
            </div>
            <div className="four">
                {<DataDisplay user_id={userId}/>}
            </div>
            <div>
            </div>
        </Container>);
}

export default DefaultLayout;