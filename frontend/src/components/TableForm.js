import React, {useEffect, useState} from 'react';
import axios from 'axios';
import {Table} from 'reactstrap';

function TableForm() {
    const [familyTreeData, setFamilyTreeData] = useState([])

    useEffect(() => {
        const fetchData = async () => {
            const response = await axios.get(`api/get/table/${localStorage.getItem('userId')}`);
            setFamilyTreeData(response.data.table);
        }
        if (!familyTreeData.length) {
            fetchData();
        }
    }, [familyTreeData]);


    return (
        <div className='selected'>
            <h3>Таблица генеалогического древа</h3>
            <Table striped bordered hover>
                <thead>
                <tr>
                    <th>Уровень родственной иерархии</th>
                    <th>ФИО (ФИО до замужества)</th>
                    <th>Степень родства</th>
                </tr>
                </thead>
                <tbody>
                {familyTreeData.map((row, index) => (
                    <tr key={index}>
                        <td>{row[0]}</td>
                        <td>{row[1]}</td>
                        <td>{row[2]}</td>
                    </tr>
                ))}
                </tbody>
            </Table>
        </div>
    )
}

export default TableForm;