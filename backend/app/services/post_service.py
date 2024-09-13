import json
from flask import make_response
from flask_restx import abort
from sqlalchemy.exc import SQLAlchemyError
from datetime import datetime
from app.models.post_model import Post
from ..extensions import db, api
import base64
import os


def create_post(payload):
    try:
        post = Post(
            title=payload["title"],
            description=payload["description"],
            soldOut=payload["soldOut"],
            verified=payload["verified"],
            gran=payload["gran"],
            location=payload["location"],
            city=payload["city"],
            phone=payload["phone"],
            price=payload["price"],
            created_user_id=payload["created_user_id"],
            created_at=datetime.utcnow(),
            updated_at=datetime.utcnow()
        )
        
        db.session.add(post)
        db.session.commit()

        post = Post.query.order_by(Post.id.desc()).first()

        assets_folder = "/Users/arkarmyo/Documents/jk/frontend/src/assets"
        if not os.path.exists(assets_folder):
            os.makedirs(assets_folder)
        image_folder = f"/Users/arkarmyo/Documents/jk/frontend/src/assets/{post.id}"

        if not os.path.exists(image_folder):
            os.makedirs(image_folder)
        post_list = []
        index = 0
        for img in payload['img']:
            image_path = os.path.join(image_folder, f"{index}.png")
            base64_string = img.split(',')[1]
            decoded_image = base64.b64decode(base64_string)
            post_list.append(f"assets/{post.id}/{index}.png")
            with open(image_path, "wb") as fh:
                fh.write(decoded_image)
            index = index + 1
        post.img = json.dumps(post_list)
        db.session.commit()
        return {}, 201
    except SQLAlchemyError as err:
        db.session.rollback()
        error_message = str(err)
        if "Duplicate entry" in error_message and "post.name_UNIQUE" in error_message:
            api.abort(400, error='duplicate name')
        else:
            api.abort(400, error=error_message)
    

def get_post_list():
    try:
        post_list = Post.query.all()
        for post in post_list:
            post.img = json.loads(post.img)

        return post_list
    except SQLAlchemyError as err:
        error_message = str(err)
        api.abort(400, error=error_message)


def get_post(id):
    try:
        post = Post.query.get(id)
        if not post:
            abort(404, error="Post not found")
        return post
    except SQLAlchemyError as err:
        error_message = str(err)
        api.abort(400, error=error_message)


def update_post(post, payload):
    try:
        if "title" in payload and payload["title"]:
            post.title = payload["title"]
        if "description" in payload and payload["description"]:
            post.description = payload["description"]
        if "price" in payload and payload["price"]:
            post.price = payload["price"]
        post.verified = payload["verified"]
        post.city=payload["city"],
        post.soldOut = payload["soldOut"]
        post.gran = payload["gran"]
        
        assets_folder = "/Users/arkarmyo/Documents/jk/frontend/src/assets"
        if not os.path.exists(assets_folder):
            os.makedirs(assets_folder)
        image_folder = f"/Users/arkarmyo/Documents/jk/frontend/src/assets/{post.id}"

        if not os.path.exists(image_folder):
            os.makedirs(image_folder)
        post_list = []
        index = 0
        for img in payload['img']:
            if "assets" not in img:
                image_path = os.path.join(image_folder, f"{index}.png")
                base64_string = img.split(',')[1]
                decoded_image = base64.b64decode(base64_string)
                post_list.append(f"assets/{post.id}/{index}.png")
                with open(image_path, "wb") as fh:
                    fh.write(decoded_image)
            else: 
                post_list.append(img)
            index = index + 1
        post.img = json.dumps(post_list)
        if "location" in payload and payload["location"]:
            post.location = payload["location"]
        if "phone" in payload and payload["phone"]:
            post.phone = payload["phone"]
        post.updated_at = datetime.utcnow()
        db.session.commit()
        return {}, 201
    except SQLAlchemyError as err:
        error_message = str(err)
        api.abort(400, error=error_message)


def delete_post(post):
    try:
        db.session.delete(post)
        db.session.commit()
        return make_response({}, 204)
    except SQLAlchemyError as err:
        error_message = str(err)
        api.abort(400, error=error_message)

def search_post(payload):
    title = None
    city = None
    if "title" in payload and payload["title"]:
            title = payload["title"]
    if "city" in payload and payload["city"]:
            city = payload["city"]
    try:
        # Start with a base query to get all books
        query = Post.query
        if title:
            query = query.filter((Post.title.ilike(f"%{title}%") ))
        if city: 
            query = query.filter((Post.city.ilike(f"%{city}")))
        posts = query.all()

        if not posts:
            abort(404, error="No books found with the given search criteria")
        for post in posts:
            post.img = json.loads(post.img)
        return posts
    except SQLAlchemyError as err:
        error_message = str(err)
        api.abort(400, error=error_message)