import React, {useState, useEffect} from 'react';
import axios from 'axios';
import './DataDisplay.css'; // стилизация компонента
import {Button} from "reactstrap"; // Подключаем компонент формы редактирования

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
        <div className='selected'>
            <Button style={{backgroundColor: '#0353a4', margin: '10px'}} onClick={getPicture}>Получить изображение</Button>
            <Button style={{backgroundColor: '#0353a4'}} onClick={handleRefreshClick}>Обновить изображение</Button>
            <div style={{width: '100%'}}>
                <img style={{width: '100%'}} id="lol" src={imageUrl} alt="Изображение не загружено"/>
            </div>
        </div>
    );
}

export default DataDisplay;
