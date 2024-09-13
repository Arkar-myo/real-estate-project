from flask_restx import fields
from app.extensions import api

post_model = api.model("Post", {
    "id": fields.Integer,
    "title": fields.String,
    "description": fields.String,
    "price": fields.String,
    "soldOut": fields.Boolean,
    "gran": fields.Boolean,
    "verified": fields.Boolean,
    "img": fields.List(fields.String),
    "location": fields.String,
    "city": fields.String,
    "phone": fields.String,
    "created_user_id": fields.Integer,
    "created_at": fields.DateTime(dt_format='iso8601'),
    "updated_at": fields.DateTime(dt_format='iso8601')
})

post_input_model = api.model("PostInput", {
    "title": fields.String,
    "description": fields.String,
    "price": fields.String,
    "soldOut": fields.Boolean,
    "gran": fields.Boolean,
    "verified": fields.Boolean(False),
    "img": fields.String,
    "city": fields.String,
    "location": fields.String,
    "phone": fields.String,
    "created_user_id": fields.Integer
})

post_search_model = api.model("PostSearchInput", {
    "text": fields.String, 
})
