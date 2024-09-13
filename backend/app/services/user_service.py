import random
from flask import make_response, render_template
from flask_restx import abort
import jwt
from sqlalchemy.exc import SQLAlchemyError
from datetime import datetime, timedelta
from app.models.user_model import User, Transaction_data
from ..models.user_model import Email_confirm
from ..config import SECRET_KEY

from ..extensions import db, api

from flask_mail import Mail, Message

mail = Mail()


def send_email(user):
    try:
        recipient_email = user["email"]
        digits = "0123456789"
        confirm_code = ''.join(random.choice(digits) for _ in range(6))

        msg = Message('Confirm Your Email',
                      sender='noreply@real.estate.com', recipients=[recipient_email])
        html_content = f"""
        <html>
            <body>
                <div style="text-align: center;">
                    <h1>Email Confirmation</h1>
                </div>
                    <p>Thank you for signing up!</p> 
                    <p>This is your confirmation code:</p>
                <div style="text-align: center;">
                    <h2 style="font-weight: bold; font-size: 20px;
                    ">{confirm_code}</h2>
                </div>
            </body>
        </html>
        """
        msg.html = html_content
        mail.send(msg)
        existing_confirm_data = Email_confirm.query.filter_by(
            email=user['email']).first()

        if existing_confirm_data:
            existing_confirm_data.confirm_code = confirm_code
            db.session.commit()
        else:
            new_confirm_data = Email_confirm(
                email=user['email'], confirm_code=confirm_code)
            db.session.add(new_confirm_data)
            db.session.commit()
        return make_response({}, 204)
    except Exception as err:
        error_message = str(err)
        api.abort(500, error=error_message)


def verify_code(user):
    try:
        existing_confirm_data = Email_confirm.query.filter_by(
            email=user['email']).first()
        if existing_confirm_data and existing_confirm_data.confirm_code == user["confirm_code"]:
            user = User(
                name=user["name"],
                email=user["email"],
                password=user["password"],
                type=user["type"],
                address=user["address"],
                phone=user["phone"],
                created_at=datetime.utcnow(),
                updated_at=datetime.utcnow()
            )
            db.session.add(user)
            db.session.delete(existing_confirm_data)
            db.session.commit()
            return user
        else:
            api.abort(400, error='invalid code')
    except SQLAlchemyError as err:
        db.session.rollback()
        error_message = str(err)
        if "Duplicate entry" in error_message and "user.email_UNIQUE" in error_message:
            api.abort(400, error='duplicate email')
        elif "Duplicate entry" in error_message and "user.name_UNIQUE" in error_message:
            api.abort(400, error='duplicate name')
        else:
            api.abort(400, error=error_message)


def send_email_forget_pw(user):
    try:
        recipient_email = user["email"]
        digits = "0123456789"
        confirm_code =  ''.join(random.choice(digits) for _ in range(6))

        msg = Message('Confirm Your Code To Change Password', sender='noreply@real.estate.com', recipients=[recipient_email])
        # msg.html = render_template('confirmation_email.html', confirm_code=confirm_code)
        html_content = f"""
        <html>
            <body>
                <div style="text-align: center;">
                    <h1>Email Confirmation To Change Password</h1>
                </div>
                    <p>This is your confirmation code:</p>
                <div style="text-align: center;">
                    <h2 style="font-weight: bold; font-size: 20px;
                    ">{confirm_code}</h2>
                </div>
            </body>
        </html>
        """
        msg.html = html_content
        mail.send(msg)
        existing_confirm_data = Email_confirm.query.filter_by(email=user['email']).first()

        if existing_confirm_data:
            existing_confirm_data.confirm_code = confirm_code
            db.session.commit()
        else:
            new_confirm_data = Email_confirm(email=user['email'], confirm_code=confirm_code)
            db.session.add(new_confirm_data)
            db.session.commit()
        return make_response({}, 204)
    except Exception as err:
        error_message = str(err)
        api.abort(500, error=error_message)


def verify_code_forget_pw(user):
    try:
        existing_confirm_data = Email_confirm.query.filter_by(email=user['email']).first()
        if existing_confirm_data and existing_confirm_data.confirm_code == user["confirm_code"]:
            existing_user = User.query.filter_by(email=user["email"]).first()
            existing_user.password = user["password"]
            existing_user.updated_at = datetime.utcnow()
            db.session.delete(existing_confirm_data)
            db.session.commit()
            return user
        else:
            api.abort(400, error='invalid code')
    except SQLAlchemyError as err:
        db.session.rollback()
        error_message = str(err)
        if "Duplicate entry" in error_message and "user.email_UNIQUE" in error_message:
            api.abort(400, error='duplicate email')
        elif "Duplicate entry" in error_message and "user.name_UNIQUE" in error_message:
            api.abort(400, error='duplicate name')
        else:
            api.abort(400, error=error_message)


def create_user(payload):
    try:
        user = User(
            name=payload["name"],
            email=payload["email"],
            password=payload["password"],
            type=payload["type"],
            address=payload["address"],
            phone=payload["phone"],
            created_at=datetime.utcnow(),
            updated_at=datetime.utcnow()
        )
        db.session.add(user)
        db.session.commit()
        return user
    except SQLAlchemyError as err:
        db.session.rollback()
        error_message = str(err)
        if "Duplicate entry" in error_message and "user.email_UNIQUE" in error_message:
            api.abort(400, error='duplicate email')
        elif "Duplicate entry" in error_message and "user.name_UNIQUE" in error_message:
            api.abort(400, error='duplicate name')
        else:
            api.abort(400, error=error_message)


def get_user_list():
    try:
        return User.query.all()
    except SQLAlchemyError as err:
        error_message = str(err)
        api.abort(400, error=error_message)


def get_user(id):
    try:
        user = User.query.get(id)
        if not user:
            abort(404, error="User not found")
        return user
    except SQLAlchemyError as err:
        error_message = str(err)
        api.abort(400, error=error_message)


def update_user(user, payload):
    try:
        if "name" in payload and payload["name"]:
            user.name = payload["name"]
        if "email" in payload and payload["email"]:
            user.email = payload["email"]
        if "password" in payload and payload["password"]:
            user.password = payload["password"]
        if "type" in payload and payload["type"]:
            user.type = payload["type"]
        if "address" in payload and payload["address"]:
            user.address = payload["address"]
        if "phone" in payload and payload["phone"]:
            user.phone = payload["phone"]
        if "verified_at" in payload and payload["verified_at"]:
            user.verified_at = datetime.utcnow()
        user.updated_at = datetime.utcnow()
        db.session.commit()
        return user
    except SQLAlchemyError as err:
        error_message = str(err)
        api.abort(400, error=error_message)


def delete_user(user):
    try:
        db.session.delete(user)
        db.session.commit()
        return make_response({}, 204)
    except SQLAlchemyError as err:
        error_message = str(err)
        api.abort(400, error=error_message)


def create_transaction(payload):
    try:
        print('trasac-=-+> ', payload['transaction_id'])
        transaction = Transaction_data(
            transaction_id=payload["transaction_id"],
            user_id=payload["user_id"],
            phone=payload["phone"],
            acc_name=payload["acc_name"],
            pay_amount=payload["pay_amount"],
            created_at=datetime.utcnow(),
            updated_at=datetime.utcnow()
        )
        db.session.add(transaction)
        db.session.commit()

        transac_user = User.query.filter_by(id=payload["user_id"]).first()

        admin_list = User.query.filter_by(type=0).all()
        if len(admin_list) > 0:
            for each_admin in admin_list:
                msg = Message(
                    'Transaction From User', sender='noreply@real.estate.com', recipients=[each_admin.email])
                html_content = f"""
                <html>
                    <body style="
                    text-align: center;
                    border: solid 1px grey;
                    border-radius: 10px;
                    width: 600px;
                    padding-bottom: 20px;
                    ">
                        <div style="
                        text-align: center;
                        ">
                            <h1>Transaction</h1>
                        </div>
                        <div style="
                        text-align: left;
                        width: 400px;
                        margin: 0 auto;
                        ">
                            <table style="
                                border-collapse: collapse;
                                width: 100%;
                            ">
                                <tr>
                                    <td style="font-weight: bold;">User ID:</td>
                                    <td>{transac_user.id}</td>
                                </tr>
                                <tr>
                                    <td style="font-weight: bold;">User Name:</td>
                                    <td>{transac_user.name}</td>
                                    
                                </tr>
                                <tr>
                                    <td style="font-weight: bold;">Account Name:</td>
                                    <td>{payload["acc_name"]}</td>
                                    
                                </tr>
                                <tr>
                                    <td style="font-weight: bold;">Transaction ID:</td>
                                    <td>{payload["transaction_id"]}</td>
                                    
                                </tr>
                                <tr>
                                    <td style="font-weight: bold;">Transaction Ammount:</td>
                                    <td>{payload["pay_amount"]}</td>
                                    
                                </tr>
                            </table>
                    </body>
                </html>
                """
                msg.html = html_content
                mail.send(msg)
        return transaction
    except SQLAlchemyError as err:
        db.session.rollback()
        error_message = str(err)
        api.abort(400, error=error_message)


def get_transaction_list():
    try:
        return Transaction_data.query.order_by(Transaction_data.created_at.desc()).all()
    except SQLAlchemyError as err:
        error_message = str(err)
        api.abort(400, error=error_message)


def get_transaction(id):
    try:
        transaction_data = Transaction_data.query.get(id)
        if not transaction_data:
            abort(404, error="User not found")
        return transaction_data
    except SQLAlchemyError as err:
        error_message = str(err)
        api.abort(400, error=error_message)


def update_transaction(transaction, payload):
    try:
        if "transaction_id" in payload and payload["transaction_id"]:
            transaction.transaction_id = payload["transaction_id"]
        if "user_id" in payload and payload["user_id"]:
            transaction.user_id = payload["user_id"]
        if "phone" in payload and payload["phone"]:
            transaction.phone = payload["phone"]
        if "acc_name" in payload and payload["acc_name"]:
            transaction.acc_name = payload["acc_name"]
        if "pay_amount" in payload and payload["pay_amount"]:
            transaction.pay_amount = payload["pay_amount"]
        transaction.updated_at = datetime.utcnow()
        db.session.commit()
        return transaction
    except SQLAlchemyError as err:
        error_message = str(err)
        api.abort(400, error=error_message)


def delete_transaction(transaction):
    try:
        db.session.delete(transaction)
        db.session.commit()
        return make_response({}, 204)
    except SQLAlchemyError as err:
        error_message = str(err)
        api.abort(400, error=error_message)
