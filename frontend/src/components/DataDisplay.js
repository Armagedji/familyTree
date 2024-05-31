import React, {useState, useEffect} from 'react';
import axios from 'axios';
import './DataDisplay.css'; // стилизация компонента
import EditForm from './EditForm'; // Подключаем компонент формы редактирования

function DataDisplay(props) {
    const [personData, setPersonData] = useState({});
    const [errorMessage, setErrorMessage] = useState('');
    const [searchCategory, setSearchCategory] = useState('name');
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [selectedPerson, setSelectedPerson] = useState(null);
    const [editMode, setEditMode] = useState(false); // Состояние для отслеживания редактирования
    const [editPerson, setEditPerson] = useState(null); // Состояние для хранения данных редактируемой персоны
    const [imageUrl, setImageUrl] = useState(null);

    const handleRefreshClick = () => {
        // Генерируем случайное число, чтобы избежать кеширования изображения
        const randomNumber = Math.random();
        const newImageUrl = `http://127.0.0.1:5000/api/picture/${props.user_id}?rand=${randomNumber}`;
        setImageUrl(newImageUrl);
    };

    useEffect(() => {
        if (selectedPerson) {
            console.log(selectedPerson);
            fetchData(selectedPerson);
        }
    }, [selectedPerson]);

    const fetchData = async (personId) => {
        try {
            const response = await axios.get(`http://127.0.0.1:5000/api/getperson/${personId}`);
            console.log("Данные: ", response.data);
            setPersonData(response.data);
            setSearchResults([]);
        } catch (error) {
            console.error('Ошибка при загрузке данных:', error);
            setErrorMessage('Ошибка при загрузке данных');
        }
    };


    const getPicture = async () => {
        const response = await axios.get(`http://127.0.0.1:5000/api/picture/${props.user_id}`)
            .then(data => {
                setImageUrl(`http://127.0.0.1:5000/api/picture/${props.user_id}`)
            })
            .catch(error => console.error('Fetch error:', error));
    }

    return (
        <div>
            <button onClick={getPicture}>Получить изображение</button>
            <button onClick={handleRefreshClick}>Обновить изображение</button>
            <img id="lol" src={imageUrl} alt="Изображение не загружено"/>
        </div>
    );
}

export default DataDisplay;
