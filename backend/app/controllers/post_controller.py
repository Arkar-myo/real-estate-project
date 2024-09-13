from flask_restx import Resource, Namespace, abort
from flask import send_from_directory
import os

from ..dto.post_dto import post_model, post_input_model, post_search_model
from ..services.auth_service import token_required

from ..models.post_model import Post
from ..services.post_service import create_post, get_post, get_post_list, update_post, delete_post, search_post


ns = Namespace("post")


@ns.route("")
class PostCreate(Resource):
    @ns.expect(post_input_model)
    @ns.marshal_with(post_model)
    def post(self):
        payload = ns.payload
        return create_post(payload)


@ns.route("/list")
class PostListApi(Resource):
    # @token_required
    @ns.marshal_list_with(post_model)
    def get(self):
        return get_post_list()


@ns.route("/<int:id>")
class PostAPI(Resource):
    @ns.marshal_with(post_model)
    def get(self, id):
        post = Post.query.get(id)
        if not post:
            abort(404, error="post not found")
        return get_post(id)

    @ns.expect(post_input_model)
    @ns.marshal_list_with(post_model)
    def put(self, id):
        post = Post.query.get(id)
        if not post:
            abort(404, error="post not found")
        payload = ns.payload
        return update_post(post, payload)

    def delete(self, id):
        post = Post.query.get(id)
        if not post:
            abort(404, error="post not found")
        return delete_post(post)


@ns.route("/search")
class PostSearchApi(Resource):
    @ns.expect(post_search_model)
    @ns.marshal_list_with(post_model)
    def post(self):
        payload = ns.payload
        return search_post(payload)