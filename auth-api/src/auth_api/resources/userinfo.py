# Copyright © 2019 Province of British Columbia
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.
"""Endpoints to get user information from token and database."""
from flask import jsonify, g
from flask_restplus import Resource, Namespace, cors
from flask_jwt_oidc import AuthError

from auth_api import jwt as _jwt
from auth_api.services import User
from auth_api.utils.util import cors_preflight
from auth_api.utils.tracing import ExceptionTracing

import opentracing
from flask_opentracing import FlaskTracing


API = Namespace('userinfo', description='Authenication System - get User Information')

# get the existing tracer and inject into flask app
tracer = opentracing.tracer
tracing = FlaskTracing(tracer)
exceptionTracing = ExceptionTracing(tracer)


@API.errorhandler(AuthError)
@exceptionTracing.trace()
def handle_auth_error(ex):
    raise Exception(jsonify(ex), ex.status_code)


@API.errorhandler(Exception)
@exceptionTracing.trace()
def handle_error(ex):
    raise Exception(jsonify(ex), ex.status_code)


@cors_preflight('GET')
@API.route('')
class UserInfo(Resource):
    """Retrieve user detail information from token and database """

    @staticmethod
    @cors.crossdomain(origin='*')
    @_jwt.requires_auth
    @tracing.trace()
    def get():
        """Return a JSON object that includes user detail information"""
        current_span = tracer.active_span
        token = g.jwt_oidc_token_info
        user = User.find_by_jwt_token(token)
        if not user:
            user = User.save_from_jwt_token(token)

        current_span.log_kv({'userinfo': user.asdict()})

        return jsonify(user.asdict()), 200
