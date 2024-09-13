from app.extensions import db
from datetime import datetime

class Post(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(50), nullable=False)
    price = db.Column(db.String(50), nullable=False)
    soldOut = db.Column(db.Boolean)
    gran = db.Column(db.Boolean)
    description = db.Column(db.String(500))
    verified = db.Column(db.Boolean, nullable=False)
    img = db.Column(db.Text, nullable=False)
    location = db.Column(db.Text, nullable=False)
    city = db.Column(db.String(50), nullable=False)
    phone = db.Column(db.String(50), nullable=False)
    created_user_id = db.Column(db.Integer, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime)