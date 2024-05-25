from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()


class User(db.Model):
    __tablename__ = 'users'
    user_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    username = db.Column(db.String(50), unique=True, nullable=False)
    password = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(50), unique=True, nullable=False)
    persons = db.relationship('Person', backref='user', lazy=True)


class Person(db.Model):
    __tablename__ = 'persons'
    person_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.user_id'), nullable=False)
    surname = db.Column(db.String(50), nullable=False)
    maiden_name = db.Column(db.String(50))
    first_name = db.Column(db.String(50), nullable=False)
    patronymic = db.Column(db.String(50))
    sex = db.Column(db.Integer, nullable=False)
    birth_date = db.Column(db.String(50))
    birth_date_approx = db.Column(db.Boolean)
    birth_country = db.Column(db.String(50))
    birth_city = db.Column(db.String(50))
    birth_street = db.Column(db.String(50))
    birth_house = db.Column(db.String(50))
    birth_apartment = db.Column(db.String(50))
    death_date = db.Column(db.String(50))
    death_date_approx = db.Column(db.Boolean)
    death_country = db.Column(db.String(50))
    death_city = db.Column(db.String(50))
    nationality = db.Column(db.String(50))
    social_status = db.Column(db.String(50))
    information_source = db.Column(db.String(200))
    life_details = db.Column(db.Text)
    is_primary_contact = db.Column(db.Boolean)
    educations = db.relationship('Education', backref='educations', lazy=True)
    professions = db.relationship('Profession', backref='professions', lazy=True)
    residences = db.relationship('Residence', backref='residences', lazy=True)

    def to_dict(self):
        return {
            'person_id': self.person_id,
            'user_id': self.user_id,
            'surname': self.surname,
            'maiden_name': self.maiden_name,
            'first_name': self.first_name,
            'patronymic': self.patronymic,
            'sex': self.sex,
            'birth_date': self.birth_date,
            'birth_date_approx': self.birth_date_approx,
            'birth_country': self.birth_country,
            'birth_city': self.birth_city,
            'birth_street': self.birth_street,
            'birth_house': self.birth_house,
            'birth_apartment': self.birth_apartment,
            'death_date': self.death_date,
            'death_date_approx': self.death_date_approx,
            'death_country': self.death_country,
            'death_city': self.death_city,
            'nationality': self.nationality,
            'social_status': self.social_status,
            'information_source': self.information_source,
            'life_details': self.life_details,
            'is_primary_contact': self.is_primary_contact
        }

class Relation(db.Model):
    __tablename__ = 'relations'
    relation_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    person_id = db.Column(db.Integer, db.ForeignKey('persons.person_id'), nullable=False)
    related_person_id = db.Column(db.Integer, db.ForeignKey('persons.person_id'), nullable=False)
    relationship_id = db.Column(db.Integer, db.ForeignKey('relationship_types.relationship_id'), nullable=False)


class Relationship_type(db.Model):
    __tablename__ = 'relationship_types'
    relationship_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    relationship_name = db.Column(db.String(50))
    relationship_level = db.Column(db.Integer)

class Education(db.Model):
    __tablename__ = 'educations'
    education_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    person_id = db.Column(db.Integer, db.ForeignKey('persons.person_id'), nullable=False)
    education = db.Column(db.String(100), nullable=False)


class Profession(db.Model):
    __tablename__ = 'professions'
    profession_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    person_id = db.Column(db.Integer, db.ForeignKey('persons.person_id'), nullable=False)
    profession = db.Column(db.String(100), nullable=False)


class Residence(db.Model):
    __tablename__ = 'residences'
    residence_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    person_id = db.Column(db.Integer, db.ForeignKey('persons.person_id'), nullable=False)
    country = db.Column(db.String(50))
    city = db.Column(db.String(50))
    street = db.Column(db.String(50))
    house = db.Column(db.String(50))
    apartment = db.Column(db.String(50))
    start_date = db.Column(db.String(50))
    end_date = db.Column(db.String(50))
