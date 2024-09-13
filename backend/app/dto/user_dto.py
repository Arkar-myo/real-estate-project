from flask_restx import fields
from app.extensions import api

user_model = api.model("User", {
    "id": fields.Integer,
    "name": fields.String,
    "email": fields.String,
    "password": fields.String,
    "token": fields.String,
    "type": fields.Integer,
    "address": fields.String,
    "phone": fields.String,
    "verified_at": fields.DateTime(dt_format='iso8601'),
    "created_at": fields.DateTime(dt_format='iso8601'),
    "updated_at": fields.DateTime(dt_format='iso8601')
})

user_input_model = api.model("UserInput", {
    "name": fields.String,
    "email": fields.String,
    "password": fields.String,
    "type": fields.Integer,
    "address": fields.String,
    "phone": fields.String,
})

confirm_input_model = api.model("ConfirmCodeInput", {
    "name": fields.String,
    "email": fields.String,
    "password": fields.String,
    "type": fields.Integer,
    "address": fields.String,
    "phone": fields.String,
    "confirm_code": fields.Integer,
})

transaction_input_model = api.model("TransactionInput", {
    "transaction_id": fields.String,
    "user_id": fields.Integer,
    "pay_amount": fields.Integer,
    "phone": fields.String,
    "acc_name": fields.String
})

transaction_model = api.model("TransactionData",{
    "id": fields.Integer,
    "transaction_id": fields.String,
    "user_id": fields.Integer,
    "pay_amount": fields.Integer,
    "phone": fields.String,
    "acc_name": fields.String
})


