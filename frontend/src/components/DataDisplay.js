import React, {useState, useEffect} from 'react';
import axios from 'axios';
import './DataDisplay.css'; // стилизация компонента
import EditForm from './EditForm'; // Подключаем компонент формы редактирования

function DataDisplay(props) {
    const [imageUrl, setImageUrl] = useState(null);

    const handleRefreshClick = () => {
        // Генерируем случайное число, чтобы избежать кеширования изображения
        const randomNumber = Math.random();
        const newImageUrl = `http://127.0.0.1:5000/api/picture/${props.user_id}?rand=${randomNumber}`;
        setImageUrl(newImageUrl);
    };

    useEffect(() => {
        const fetchData = async () => {
            const response = await axios.get(`http://127.0.0.1:5000/api/picture/${props.user_id}`)
            .then((data) => {
                setImageUrl(`http://127.0.0.1:5000/api/picture/${props.user_id}`);
                console.log(data);
            })
            .catch(error => console.error('Fetch error:', error));
        }
        if (!imageUrl) {
            fetchData();
        }
    }, []);

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
