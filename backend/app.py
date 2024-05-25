import sqlalchemy
from flask import Flask, request, jsonify
from flask_restful import fields, marshal_with
from flask_cors import CORS
from models import db, User, Person, Education, Profession, Residence, Relation
import traceback
from datetime import datetime

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
    print('1')
    data = request.json
    user_id = 1
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


@app.route('/api/setrelationship', methods=['POST'])
def set_relationship():
    try:
        data = request.json
        sex1 = Person.query.get(int(data['person1'])).sex
        sex2 = Person.query.get(int(data['person2'])).sex
        relationship1 = Relation(person_id=data['person1'],
                                 related_person_id=data['person2'],
                                 relationship_id=2 * int(data['relationship']) - sex1)
        relationship2 = Relation(person_id=data['person2'],
                                 related_person_id=data['person1'],
                                 relationship_id=2 * int(data['relationship']) - sex2)
        db.session.add(relationship1)
        db.session.add(relationship2)
        db.session.commit()
        return jsonify({'message': 'Relationship was created!'}), 201
    except Exception as e:
        return jsonify({"error": e}), 500


@app.route('/api/search/<category>/<query>', methods=['GET'])
def search_persons(category, query):
    try:
        if category == 'name':
            persons = Person.query.filter(
                (Person.first_name.contains(query)) |
                (Person.surname.contains(query)) |
                (Person.patronymic.contains(query))
            ).all()
        elif category == 'birth_place':
            persons = Person.query.filter(
                (Person.birth_country.contains(query)) |
                (Person.birth_city.contains(query)) |
                (Person.birth_street.contains(query))
            ).all()
        elif category == 'residences':
            persons = Person.query.join(Residence).filter(
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


@app.route('/api/getperson', methods=['GET'])
@marshal_with(person_fields)
def return_persons():
    persons = Person.query.all()
    return persons


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
