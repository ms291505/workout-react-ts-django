from django.conf import settings
from rest_framework_simplejwt.tokens import RefreshToken

class CookieTokenMixin:
    """
    Mixin provides a single set_jwt_cookies() method
    that will pull names/paths/options from settings.SIMPLE_JWT
    and set both access & refresh cookies.
    """

    def jwt_setting_key(self, token_type: str, suffix: str=""):
        return f"AUTH_COOKIE{'_REFRESH' if token_type=='refresh' else ''}{suffix}"

    def set_jwt_cookies(self, response, token_data):
        """
        token_data is the dict returned by the serializer,
        e.g. {'access': '…', 'refresh': '…'}
        """
        jwt_conf = settings.SIMPLE_JWT

        for token_type in ('access', 'refresh'):
            if token_type not in token_data:
                continue

            # build setting‑names dynamically
            cookie_name = jwt_conf[self.jwt_setting_key(token_type)]
            path        = jwt_conf[self.jwt_setting_key(token_type, "_PATH")]
            opts        = {
                'secure'  : jwt_conf['AUTH_COOKIE_SECURE'],
                'httponly': jwt_conf['AUTH_COOKIE_HTTP_ONLY'],
                'samesite': jwt_conf['AUTH_COOKIE_SAMESITE'],
                'path'    : path,
            }

            response.set_cookie(cookie_name,
                                token_data[token_type],
                                **opts)
