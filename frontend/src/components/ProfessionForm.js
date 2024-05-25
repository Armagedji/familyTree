import React, { useState } from 'react';

function ProfessionForm() {
    const [professions, setProfessions] = useState([]);
  const [currentProfession, setCurrentProfession] = useState('');

  const handleProfessionChange = (e) => {
    setCurrentProfession(e.target.value);
  };

  const addProfession = () => {
    if (currentProfession.trim() !== '') {
      const id = Date.now().toString();
      const newProfession = {
        id: id,
        name: currentProfession
      };
      setProfessions([...professions, newProfession]);
      setCurrentProfession('');
    }
  };

  const removeProfession = (id) => {
    const updatedProfessions = professions.filter(profession => profession.id !== id);
    setProfessions(updatedProfessions);
  };

    return (
        <div>
            <h2>Введите профессии:</h2>
            <div>
                <input
                    type="text"
                    value={currentProfession}
                    onChange={handleProfessionChange}
                    placeholder="Введите профессию"
                />
                <button onClick={addProfession}>Добавить профессию</button>
            </div>
            <ul>
                {professions.map(profession => (
                    <li key={profession.id}>
                        {profession.name}
                        <button onClick={() => removeProfession(profession.id)}>Удалить</button>
                    </li>
                ))}
            </ul>
        </div>
    )
}

export default ProfessionForm;