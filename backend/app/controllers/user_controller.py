from flask_restx import Resource, Namespace, abort
from flask import send_from_directory
import os


from ..services.auth_service import token_required
from flask_jwt_extended import jwt_required

from ..dto.user_dto import user_model, user_input_model, confirm_input_model, transaction_input_model, transaction_model
from ..dto.error_dto import error_model
from ..extensions import api
from ..models.user_model import User, Transaction_data
from ..services.user_service import create_user, get_user_list, get_user, update_user, delete_user, send_email, verify_code, get_transaction_list, get_transaction, update_transaction, create_transaction, delete_transaction, send_email_forget_pw, verify_code_forget_pw
from .auth_controller import authorizations

ns = Namespace("user", authorizations=authorizations)


@ns.route("/send_email")
class RegisterUser(Resource):
    @ns.expect(confirm_input_model)
    @ns.marshal_with(user_model)
    def post(self):
        payload = ns.payload
        return send_email(payload)

@ns.route("/verify")
class VerifyEmail(Resource):
    @ns.expect(confirm_input_model)
    @ns.marshal_with(user_model)
    def post(self):
        payload = ns.payload
        return verify_code(payload)
    
@ns.route("/send_email_forget_pw")
class RegisterUser(Resource):
    @ns.expect(confirm_input_model)
    @ns.marshal_with(user_model)
    def post(self):
        payload = ns.payload
        return send_email_forget_pw(payload)

@ns.route("/verify_forget_pw")
class VerifyEmail(Resource):
    @ns.expect(confirm_input_model)
    @ns.marshal_with(user_model)
    def post(self):
        payload = ns.payload
        return verify_code_forget_pw(payload)

@ns.route("")
class UserCreate(Resource):
    @ns.expect(user_input_model)
    @ns.marshal_with(user_model)
    def post(self):
        payload = ns.payload
        return create_user(payload)


@ns.route("/list")
class UserListApi(Resource):
    # @token_required
    # method_decorators = [jwt_required()]
    @ns.doc(security="jsonWebToken")
    @ns.marshal_list_with(user_model)
    @api.response(400, "Bad Request", error_model)
    @api.response(401, "Unauthorized")
    def get(self):
        return get_user_list()


@ns.route("/<int:id>")
class UserAPI(Resource):
    @ns.marshal_with(user_model)
    @api.response(404, "user not found")
    def get(self, id):
        return get_user(id)

    @ns.expect(user_input_model)
    @ns.marshal_with(user_model)
    @api.response(404, "user not found")
    def put(self, id):
        user = User.query.get(id)
        if not user:
            abort(404, error="user not found")
        payload = ns.payload
        return update_user(user, payload)

    @api.response(404, "user not found")
    def delete(self, id):
        user = User.query.get(id)
        if not user:
            abort(404, error="user not found")
        return delete_user(user)

@ns.route("/transaction")
class UserCreate(Resource):
    @ns.expect(transaction_input_model)
    @ns.marshal_with(transaction_model)
    def post(self):
        payload = ns.payload
        return create_transaction(payload)

@ns.route("/transaction/list")
class UserListApi(Resource):
    # @token_required
    # method_decorators = [jwt_required()]
    @ns.doc(security="jsonWebToken")
    @ns.marshal_list_with(transaction_model)
    @api.response(400, "Bad Request", error_model)
    @api.response(401, "Unauthorized")
    def get(self):
        return get_transaction_list()


@ns.route("/transaction/<int:id>")
class UserAPI(Resource):
    @ns.marshal_with(transaction_model)
    @api.response(404, "user not found")
    def get(self, id):
        return get_transaction(id)

    @ns.expect(transaction_input_model)
    @ns.marshal_with(transaction_model)
    @api.response(404, "transaction not found")
    def put(self, id):
        transaction = Transaction_data.query.get(id)
        if not transaction:
            abort(404, error="transaction not found")
        payload = ns.payload
        return update_transaction(transaction, payload)

    @api.response(404, "transaction not found")
    def delete(self, id):
        transaction = Transaction_data.query.get(id)
        if not transaction:
            abort(404, error="transaction not found")
        return delete_transaction(transaction)
