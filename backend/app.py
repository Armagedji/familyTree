import sqlalchemy
from sqlalchemy.orm import joinedload, contains_eager
from flask import Flask, request, jsonify, send_file
from flask_restful import fields, marshal_with
from flask_cors import CORS
from models import db, User, Person, Education, Profession, Residence, Relation
import traceback
import graphviz
import sqlite3
from sqlalchemy.orm import aliased
import os, glob

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///geneologicTree.db'
db.init_app(app)
CORS(app)

app.app_context().push()

user_fields = {'user_id': fields.Integer, 'username': fields.String, 'password': fields.String,
               'email': fields.String}
person_fields = {'person_id': fields.Integer, 'user_id': fields.Integer, 'surname': fields.String,
                 'maiden_name': fields.String, 'first_name': fields.String, 'patronymic': fields.String,
                 'sex': fields.Integer,
                 'birth_date': fields.String, 'birth_date_approx': fields.Boolean, 'birth_country': fields.String,
                 'birth_city': fields.String, 'birth_street': fields.String, 'birth_house': fields.String,
                 'birth_apartment': fields.String, 'death_date': fields.String, 'death_date_approx': fields.Boolean,
                 'death_country': fields.String, 'death_city': fields.String, 'nationality': fields.String,
                 'social_status': fields.String, 'information_source': fields.String, 'life_details': fields.String,
                 'is_primary_contact': fields.Boolean, }


@app.route('/api/setperson', methods=['POST'])
def add_person():
    data = request.json
    user_id = data['user_id']
    nested = db.session.begin_nested()
    try:
        new_person = Person(
            user_id=user_id,
            surname=data['surname'],
            maiden_name=data.get('maiden_name', ''),
            first_name=data['first_name'],
            patronymic=data.get('patronymic', ''),
            sex=data.get('sex', ''),
            birth_date=data.get('birth_date', None),
            birth_date_approx=data.get('birth_date_approx', False),
            birth_country=data.get('birth_country', ''),
            birth_city=data.get('birth_city', ''),
            birth_street=data.get('birth_street', ''),
            birth_house=data.get('birth_house', ''),
            birth_apartment=data.get('birth_apartment', ''),
            death_date=data.get('death_date', None),
            death_date_approx=data.get('death_date_approx', False),
            death_country=data.get('death_country', ''),
            death_city=data.get('death_city', ''),
            nationality=data.get('nationality', ''),
            social_status=data.get('social_status', ''),
            information_source=data.get('information_source', ''),
            life_details=data.get('life_details', ''),
            is_primary_contact=data.get('is_primary_contact', False),
        )
        if 'professions' in data:
            for profession in data['professions']:
                new_profession = Profession(profession=profession)
                new_person.professions.append(new_profession)

            # Добавляем образования
        if 'educations' in data:
            for education in data['educations']:
                new_education = Education(education=education)
                new_person.educations.append(new_education)

            # Добавляем места жительства
        if 'residences' in data:
            for residence_data in data['residences']:
                new_residence = Residence(
                    country=residence_data.get('country'),
                    city=residence_data.get('city'),
                    street=residence_data.get('street'),
                    house=residence_data.get('house'),
                    apartment=residence_data.get('apartment'),
                    start_date=residence_data.get('start_date'),
                    end_date=residence_data.get('end_date')
                )
                new_person.residences.append(new_residence)

        db.session.add(new_person)
        db.session.commit()
        return jsonify({'message': 'Person added successfully', 'person_id': new_person.person_id}), 201
    except Exception as e:
        print(type(e))
        print('--' * 50)
        print(traceback.format_exc())
        nested.rollback()
    print(data['residences'])

@app.route('/api/delete/<person_id>', methods=['DELETE'])
def delete_person(person_id):
    try:
        # Удаление записей из таблицы Residence
        Residence.query.filter_by(person_id=person_id).delete()

        # Удаление записей из таблицы Profession
        Profession.query.filter_by(person_id=person_id).delete()

        # Удаление записей из таблицы Education
        Education.query.filter_by(person_id=person_id).delete()

        # Удаление записей из таблицы Relation
        Relation.query.filter_by(person_id=person_id).delete()
        Relation.query.filter_by(related_person_id=person_id).delete()

        # Удаление записей из таблицы Person
        Person.query.filter_by(person_id=person_id).delete()

        db.session.commit()

        return jsonify({'message': 'Person and related data deleted successfully'}), 200
    except Exception as e:
        db.session.rollback()
        print(e)
        return jsonify({'message': 'Failed to delete person and related data', 'error': str(e)}), 500

@app.route('/api/get/table', methods=['GET'])
def get_table():
    try:
        conn = sqlite3.connect('./instance/geneologicTree.db')
        cursor = conn.cursor()

        # Запрос с рекурсивной CTE для FamilyTree
        recursive_query = """WITH RECURSIVE FamilyTree AS (
    -- Base case: выбираем изначального человека
    SELECT
        0 AS level,
        p.person_id,
        p.first_name,
        p.surname,
		p.sex,
        NULL AS relationship_type
    FROM Persons p
    WHERE p.is_primary_contact = 1

    UNION ALL

    -- Recursive case: выбираем родителей и детей
    SELECT
        ft.level + 1 AS level,
        p.person_id,
        p.first_name,
        p.surname,
		p.sex,
        r.relationship_type
    FROM Relations r
    JOIN Persons p ON r.related_person_id = p.person_id
    JOIN FamilyTree ft ON r.person_id = ft.person_id
	WHERE r.relationship_type = 'parent-child'
	

), FamilyTree1 AS (
    -- Base case: выбираем изначального человека
    SELECT
        0 AS level,
        p.person_id,
        p.first_name,
        p.surname,
		p.sex,
        NULL AS relationship_type
    FROM Persons p
    WHERE p.is_primary_contact = 1

    UNION ALL

    -- Recursive case: выбираем супругов и братьев/сестер
    SELECT
        ft.level - 1 AS level,
        p.person_id,
        p.first_name,
        p.surname,
		p.sex,
        r.relationship_type
    FROM Relations r
    JOIN Persons p ON r.person_id = p.person_id
    JOIN FamilyTree1 ft ON r.related_person_id = ft.person_id
	WHERE r.relationship_type = 'parent-child'
	
	UNION ALL

    -- Recursive case: выбираем супругов и братьев/сестер
    SELECT
        ft.level AS level,
        p.person_id,
        p.first_name,
        p.surname,
		p.sex,
        r.relationship_type
    FROM Relations r
    JOIN Persons p ON r.related_person_id = p.person_id
    JOIN FamilyTree1 ft ON r.person_id = ft.person_id
	WHERE r.relationship_type = 'siblings'
	
	UNION ALL
	
	SELECT
        ft.level AS level,
        p.person_id,
        p.first_name,
        p.surname,
		p.sex,
        r.relationship_type
    FROM Relations r
    JOIN Persons p ON r.related_person_id = p.person_id
    JOIN FamilyTree1 ft ON r.person_id = ft.person_id
	WHERE r.relationship_type = 'spouse'
)

-- Итоговый запрос, который форматирует результат
SELECT
    ft.level AS "Уровень родственной иерархии",
    p.surname || ' ' || p.first_name || COALESCE(' ' || p.patronymic, '') || 
    CASE 
        WHEN p.maiden_name IS NOT NULL AND p.maiden_name != '' THEN ' (' || p.maiden_name || ')' 
        ELSE '' 
    END AS "ФИО (ФИО до замужества)",
	CASE
		WHEN ft.level = 0 AND ft.relationship_type IS NULL THEN 'Обратившийся'
		WHEN ft.level = 0 AND ft.relationship_type = 'siblings' AND p.sex = 0 THEN 'Брат'
		WHEN ft.level = 0 AND ft.relationship_type = 'siblings' AND p.sex = 1 THEN 'Сестра'
		WHEN ft.level = 0 AND ft.relationship_type = 'spouse' AND p.sex = 0 THEN 'Муж'
		WHEN ft.level = 0 AND ft.relationship_type = 'spouse' AND p.sex = 1 THEN 'Жена'
        WHEN ft.level = -1 AND ft.relationship_type != 'siblings' THEN 'Родитель'
		WHEN ft.level = -1 AND ft.relationship_type = 'siblings' AND p.sex = 0 THEN 'Дядя'
		WHEN ft.level = -1 AND ft.relationship_type = 'siblings' AND p.sex = 1 THEN 'Тетя'
        WHEN ft.level = -2 AND p.sex = 0 THEN 'Дедушка'
        WHEN ft.level = -2 AND p.sex = 1 THEN 'Бабушка'
        WHEN ft.level = -3 AND p.sex = 0 THEN 'Прадедушка'
        WHEN ft.level = -3 AND p.sex = 1 THEN 'Прабабушка'
        WHEN ft.level = 1 THEN 'Ребенок'
        WHEN ft.level = 2 AND p.sex = 0 THEN 'Внук'
        WHEN ft.level = 2 AND p.sex = 1 THEN 'Внучка'
        WHEN ft.level = 3 AND p.sex = 0 THEN 'Правнук'
        WHEN ft.level = 3 AND p.sex = 1 THEN 'Правнучка'
        ELSE 'Дальний родственник'
    END AS "Степень родства"
FROM FamilyTree ft
JOIN Persons p ON ft.person_id = p.person_id
UNION
SELECT
    ft.level AS "Уровень родственной иерархии",
    p.surname || ' ' || p.first_name || COALESCE(' ' || p.patronymic, '') || 
    CASE 
        WHEN p.maiden_name IS NOT NULL AND p.maiden_name != '' THEN ' (' || p.maiden_name || ')' 
        ELSE '' 
    END AS "ФИО (ФИО до замужества)",
	CASE
		WHEN ft.level = 0 AND ft.relationship_type IS NULL THEN 'Обратившийся'
		WHEN ft.level = 0 AND ft.relationship_type = 'siblings' AND p.sex = 0 THEN 'Брат'
		WHEN ft.level = 0 AND ft.relationship_type = 'siblings' AND p.sex = 1 THEN 'Сестра'
		WHEN ft.level = 0 AND ft.relationship_type = 'spouse' AND p.sex = 0 THEN 'Муж'
		WHEN ft.level = 0 AND ft.relationship_type = 'spouse' AND p.sex = 1 THEN 'Жена'
        WHEN ft.level = -1 AND ft.relationship_type != 'siblings' THEN 'Родитель'
		WHEN ft.level = -1 AND ft.relationship_type = 'siblings' AND p.sex = 0 THEN 'Дядя'
		WHEN ft.level = -1 AND ft.relationship_type = 'siblings' AND p.sex = 1 THEN 'Тетя'
        WHEN ft.level = -2 AND p.sex = 0 THEN 'Дедушка'
        WHEN ft.level = -2 AND p.sex = 1 THEN 'Бабушка'
        WHEN ft.level = -3 AND p.sex = 0 THEN 'Прадедушка'
        WHEN ft.level = -3 AND p.sex = 1 THEN 'Прабабушка'
        WHEN ft.level = 1 THEN 'Ребенок'
        WHEN ft.level = 2 AND p.sex = 0 THEN 'Внук'
        WHEN ft.level = 2 AND p.sex = 1 THEN 'Внучка'
        WHEN ft.level = 3 AND p.sex = 0 THEN 'Правнук'
        WHEN ft.level = 3 AND p.sex = 1 THEN 'Правнучка'
        ELSE 'Дальний родственник'
    END AS "Степень родства"
FROM FamilyTree1 ft
JOIN Persons p ON ft.person_id = p.person_id
ORDER BY ft.level ASC;
"""

        # Выполнение запроса и получение результатов
        cursor.execute(recursive_query)
        results = cursor.fetchall()

        # Вывод результатов
        for row in results:
            print(row)

        # Закрытие соединения с базой данных
        conn.close()
        return jsonify({'message': 'Успешное получение таблицы!', 'table': results}), 200
    except Exception as e:
        db.session.rollback()
        print(e)
        return jsonify({'message': 'Ошибка при получении человека!'}), 400

@app.route('/api/edit/<search_id>', methods=['PUT'])
def edit_person(search_id):
    nested = db.session.begin_nested()
    try:
        nested = db.session.begin_nested()
        data = request.json
        educations = data.pop('educations')
        professions = data.pop('professions')
        residences = data.pop('residences')
        user_id = 1
        person = db.session.query(Person).get(search_id)
        print("До: ", person.professions)
        db.session.query(Profession).filter(Profession.person_id == search_id).delete()
        db.session.query(Education).filter(Education.person_id == search_id).delete()
        db.session.commit()
        print("После: ", person.professions)
        print("professions:", professions)
        for key, value in data.items():
            setattr(person, key, value)
        for i in professions:
            db.session.add(Profession(profession=i, person_id=person.person_id))
        for i in educations:
            db.session.add(Education(education=i, person_id=person.person_id))
        for i in residences:
            db.session.add(Residence(country=i['country'], city=i['city'], street=i['street'],
                                     house=i['house'], apartment=i['apartment'],
                                     start_date=i['start_date'], end_date=i['end_date'],
                                     person_id=person.person_id))
        db.session.commit()
        return jsonify({'message': "Все ок!", 'person_id': search_id}), 201
    except Exception as e:
        db.session.rollback()
        print(e)
        return jsonify({'error': str(type(e))}), 500


@app.route('/api/picture/<user_id>', methods=['GET'])
def send_picture(user_id):
    try:
        #data = db.session.query(Relation).options(joinedload(Relation.person),
        #                                          joinedload(Relation.related_person)).all()
        person1 = aliased(Person)
        person2 = aliased(Person)

        data = db.session.query(Relation) \
            .join(person1, Relation.person_id == person1.person_id) \
            .join(person2, Relation.related_person_id == person2.person_id) \
            .filter(person1.user_id == user_id) \
            .filter(person2.user_id == user_id) \
            .all()
        print(data)
        if len(data) == 0:
            files = glob.glob(f'./doctest-output/{user_id}/*')
            for f in files:
                os.remove(f)
            return jsonify({"message": "Родственных связей не существует."}), 400
        # Сериализуем данные, включая имена людей
        serialized_data = [
            {
                'relation_id': relation.relation_id,
                'person_id': relation.person_id,
                'related_person_id': relation.related_person_id,
                'relationship_type': relation.relationship_type,
                'person_name': f'{relation.person.first_name} {relation.person.surname}',  # Добавляем имя person
                'related_person_name': f'{relation.related_person.first_name} {relation.related_person.surname}'# Добавляем имя related_person
            }
            for relation in data
        ]
        persons = set()
        for relation in serialized_data:
            persons.add(relation['person_id'])  # person_id
            persons.add(relation['related_person_id'])  # related_person_id

        d = graphviz.Digraph(format='png')

        for item in serialized_data:
            person_id = item['person_id']
            related_person_id = item['related_person_id']
            relationship_type = item['relationship_type']
            person_name = item['person_name']
            related_person_name = item['related_person_name']
            if relationship_type == 'siblings':
                with d.subgraph() as s:
                    s.attr(rank='same')
                    s.node(str(person_id), person_name)
                    s.node(str(related_person_id), related_person_name)
            elif relationship_type == 'spouse':
                with d.subgraph() as s:
                    s.attr(rank='same')
                    s.node(str(person_id), person_name)
                    s.node(str(related_person_id), related_person_name)
                d.edge(str(person_id), str(related_person_id), arrowhead='none', color = "black:invis:black")
            else:
                d.node(str(person_id), person_name)
                d.edge(str(person_id), str(related_person_id))

        d.render(directory=f'doctest-output/{user_id}')
        return send_file(f'./doctest-output/{user_id}/Digraph.gv.png', mimetype='image/png')
    except Exception as e:
        print(e)
        return jsonify({'error': str(type(e))}), 500

@app.route('/setuser', methods=['POST'])
def add_user():
    try:
        data = request.json
        new_user = User(
            username=data['username'],
            password=data['password'],
            email=data['email'])
        db.session.add(new_user)
        db.session.commit()
        return "Все окей!"
    except sqlalchemy.exc.IntegrityError as e:
        print("Ты еблан, что то уже занято")
        return jsonify({'message': 'Similar username or email already exists', 'error': "Bad data"}), 400
    except Exception as e:
        print(e)
        return str(e)

@app.route('/api/login', methods=['POST'])
def return_user():
    try:
        data = request.json
        print(data)
        first_query = db.session.query(User).filter(
            User.username.like(data['usernameOrEmail']),
            User.password.like(data['password']),
        ).first()
        second_query = db.session.query(User).filter(
            User.email.like(data['usernameOrEmail']),
            User.password.like(data['password']),
        ).first()
        print(first_query, second_query)

        if first_query and second_query:
            return jsonify({'message': 'Пользователь не найден'}), 400
        elif first_query:
            return jsonify({'message': 'Успешный вход!', 'user': first_query.user_id}), 200
        return jsonify({'message': 'Успешный вход!', 'user': second_query.user_id}), 200

    except Exception as e:
        print(e)
        return str(e)


@app.route('/api/setrelationship', methods=['POST'])
def set_relationship():
    try:
        data = request.json
        relationship = Relation(person_id=data['person1'],
                                 related_person_id=data['person2'],
                                 relationship_type=data['relationship'])
        db.session.add(relationship)
        db.session.commit()
        return jsonify({'message': 'Relationship was created!'}), 201
    except Exception as e:
        return jsonify({"error": e}), 500


@app.route('/api/search/<user_id>/<category>/<query>', methods=['GET'])
def search_persons(user_id, category, query):
    try:
        if category == 'name':
            persons = Person.query.filter(
                Person.user_id == user_id,
                (Person.first_name.contains(query)) |
                (Person.surname.contains(query)) |
                (Person.maiden_name.contains(query)) |
                (Person.patronymic.contains(query))
            ).all()
        elif category == 'birth_place':
            persons = Person.query.filter(
                Person.user_id == user_id,
                (Person.birth_country.contains(query)) |
                (Person.birth_city.contains(query)) |
                (Person.birth_street.contains(query))
            ).all()
        elif category == 'residences':
            persons = Person.query.join(Residence).filter(
                Person.user_id == user_id,
                (Residence.country.contains(query)) |
                (Residence.city.contains(query)) |
                (Residence.street.contains(query))
            ).all()
        else:
            return jsonify({'error': 'Invalid category'})

        if not persons:
            return jsonify({'message': 'No persons found'})

        # Сериализация результатов
        serialized_persons = [person.to_dict() for person in persons]
        return jsonify(serialized_persons)

    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/api/getpersons/<user_id>', methods=['GET'])
@marshal_with(person_fields)
def return_persons(user_id):
    print(user_id)
    persons = (Person.query.filter_by(user_id = int(user_id))).all()
    print(persons)
    serialized_persons = [person.to_dict() for person in persons]
    print(serialized_persons)
    return serialized_persons


@app.route('/api/getperson/<person_id>', methods=['GET'])
def get_person(person_id):
    try:
        person = Person.query.get(int(person_id))
        if not person:
            return jsonify({'error': 'Person not found'}), 404

        professions = Profession.query.filter_by(person_id=int(person_id)).all()
        profession_names = [profession.profession for profession in professions]

        educations = Education.query.filter_by(person_id=int(person_id)).all()
        education_names = [education.education for education in educations]

        residences = Residence.query.filter_by(person_id=int(person_id)).all()
        residence_list = [{
            'country': residence.country,
            'city': residence.city,
            'street': residence.street,
            'house': residence.house,
            'apartment': residence.apartment,
            'start_date': residence.start_date if residence.start_date else None,
            'end_date': residence.end_date if residence.end_date else None
        } for residence in residences]

        person_dict = person.to_dict()
        person_dict['professions'] = profession_names
        person_dict['educations'] = education_names
        person_dict['residences'] = residence_list

        return jsonify(person_dict), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/getuser', methods=['GET'])
@marshal_with(user_fields)
def show_table():
    users = User.query.all()
    return users


if __name__ == '__main__':
    app.run(host='0.0.0.0', threaded=True, port=5000, debug=True)
