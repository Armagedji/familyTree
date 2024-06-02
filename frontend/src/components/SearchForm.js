import axios from "axios";
import React, {useState} from "react";
import {Button, Input, InputGroup, Label} from "reactstrap";


function SearchForm({personData}) {
    const [userId, setUserId] = useState(localStorage.getItem('userId'));
    const [searchCategory, setSearchCategory] = useState('name');
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [errorMessage, setErrorMessage] = useState('');
    const [selectedPerson, setSelectedPerson] = useState(null);

    const handleSearch = async () => {
        await axios.get(`http://127.0.0.1:5000/api/search/${userId}/${searchCategory}/${searchQuery}`)
            .then((response) => {
                console.log("Результаты поиска: ", response.data, userId);
                setSearchResults(response.data);
                setErrorMessage('');
            })
            .catch((error) => {
                console.error('Ошибка при выполнении поиска:', error);
                setErrorMessage('Ошибка при выполнении поиска');
                setSearchResults([]);
            });
    }

    const fetchData = async (personId) => {
        await axios.get(`http://127.0.0.1:5000/api/getperson/${personId}`)
            .then((response) => {
                console.log("Данные: ", response.data);
                personData(response.data);
                setSearchResults([]);
            })
            .catch((error) => {
                console.error('Ошибка при загрузке данных:', error);
                setErrorMessage('Ошибка при загрузке данных');
            });
    };

    const handleSelectPerson = async (personId) => {
        setSelectedPerson(personId); // Устанавливаем выбранного человека
        fetchData(personId); // Загружаем данные выбранного человека
    };

    return (<div className='selected'>
            <h4>Поиск человека</h4>
            <InputGroup className="search-section">
                <Label>Категория поиска:
                    <Input type="select" value={searchCategory} onChange={(e) => setSearchCategory(e.target.value)}>
                        <option value="name">ФИО</option>
                        <option value="birth_place">Место рождения</option>
                        <option value="residences">Место жительства</option>
                    </Input>
                </Label>
                <InputGroup>
                    <Input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                           placeholder="Введите запрос"/>
                    <Button style={{backgroundColor: '#0353a4'}} onClick={handleSearch}>Поиск</Button>
                </InputGroup>
            </InputGroup>

            {
                errorMessage && <p className="error-message">{errorMessage}</p>
            }

            <div className="search-results">
                {searchResults.length > 0 && (
                    <ul>
                        {searchResults.map(result => (
                            <li key={result.id}>
                                <Button style={{backgroundColor: '#0353a4'}} onClick={() => handleSelectPerson(result.person_id)}>
                                    {result.surname} {result.first_name} {result.patronymic} {result.maiden_name ? `(${result.maiden_name})` : ""}
                                </Button>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    )
}

export default SearchForm;