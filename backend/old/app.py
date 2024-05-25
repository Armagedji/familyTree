from flask import Flask, request, jsonify, render_template
from flask_restful import fields, marshal_with
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)
CORS(app)

app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///geneologicTree.db'
db = SQLAlchemy(app)

app.app_context().push()

resource_fields = {'id': fields.Integer, 'firstname': fields.String, 'lastname': fields.String,
                   'patronymic': fields.String}


class User(db.Model):
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    firstname = db.Column(db.String(50), nullable=False)
    lastname = db.Column(db.String(50), nullable=False)
    patronymic = db.Column(db.String(50), nullable=False)


db.create_all()





@app.route('/namelist', methods=['POST'])
def calculate_sum():
    try:
        data = request.get_json()
        print(data)
        new_user = User(
            firstname=data['firstname'],
            lastname=data['lastname'],
            patronymic=data['patronymic'])
        db.session.add(new_user)
        db.session.commit()
        return "Все окей!"
    except Exception as e:
        return str(e)


@app.route('/', methods=['GET'])
def show_data():
    hi = []
    for user in User.query.all():
        hi.append(user.firstname + ' ' + user.lastname + ' ' + str(user.patronymic))
    print(hi)


@app.route('/table', methods=['GET'])
@marshal_with(resource_fields)
def show_table():
    users = User.query.all()
    return users


if __name__ == '__main__':
    app.run(host='0.0.0.0', threaded=True, port=5000, debug=True)
