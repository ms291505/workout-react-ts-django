from pathlib import Path
from datetime import timedelta
from dotenv import load_dotenv
import os
import json

env_path = Path(__file__).resolve().parent / ".env"
load_dotenv(dotenv_path=env_path)

SECRET_KEY = os.environ.get("SECRET_KEY")
DEBUG = os.environ.get("DEBUG", "false").lower() == "true"
PROD = os.environ.get("PROD", "false").lower() == "true"


# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent

if PROD:
  STATIC_ROOT = os.path.join(BASE_DIR, "staticfiles")
  SECURE_PROXY_SSL_HEADER = ("HTTP_X_FORWARDED_PROTO", "https")
  ALLOWED_HOSTS = json.loads(os.environ.get("ALLOWED_HOSTS", "[]"))
  SECURE_SSL_REDIRECT = False
else:
  ALLOWED_HOSTS = []

PROJECT_LOGGING_FLAG = DEBUG


STATIC_URL = "/static/"

LOGGING = {
  "version": 1,
  "disable_existing_loggers": False,
  "formatters": {
    "verbose": {
      "format": "{asctime} {levelname:<8} [{name}] {message}",
      "style": "{",
    },
  },
  "handlers": {
    "console": {
      "class": "logging.StreamHandler",
      "formatter": "verbose",
    },
  },
  "loggers": {
    "django": {
      "handlers": ["console"],
      "level": "INFO",
    },
    "api": {
      "handlers": ["console"],
      "level": "DEBUG",
      "propagate": False,
    },
  }
}


REST_FRAMEWORK = {
    "DEFAULT_AUTHENTICATION_CLASSES": (
        "api.authentication.CookieJWTAuthentication",
        "rest_framework.authentication.SessionAuthentication",
    ),
    "DEFAULT_PERMISSION_CLASSES": [
        "rest_framework.permissions.IsAuthenticated",
    ],

    "DEFAULT_RENDERER_CLASSES": [
        "djangorestframework_camel_case.render.CamelCaseJSONRenderer",
        "djangorestframework_camel_case.render.CamelCaseBrowsableAPIRenderer",
        "rest_framework.renderers.JSONRenderer",
    ],
    "DEFAULT_PARSER_CLASSES": [
        "djangorestframework_camel_case.parser.CamelCaseJSONParser",
        "djangorestframework_camel_case.parser.CamelCaseFormParser",
        "djangorestframework_camel_case.parser.CamelCaseMultiPartParser",
        "rest_framework.parsers.JSONParser",
    ],
    "DEFAULT_THROTTLE_CLASSES": [
      "rest_framework.throttling.UserRateThrottle",
      "rest_framework.throttling.AnonRateThrottle",
    ],
    "DEFAULT_THROTTLE_RATES": {
      "user": "1000/hour",
      "anon": "100/hour"
    }
}


SIMPLE_JWT = {
    "ACCESS_TOKEN_LIFETIME": timedelta(minutes=30),
    "REFRESH_TOKEN_LIFETIME": timedelta(days=1),

    # shared options for the access and refresh tokens
    "AUTH_COOKIE_SECURE": False,
    "AUTH_COOKIE_HTTP_ONLY": True,
    "AUTH_COOKIE_SAMESITE": "Lax",

    # token specific options
    "AUTH_COOKIE": "access_token",
    "AUTH_COOKIE_PATH": "/",

    "AUTH_COOKIE_REFRESH": "refresh_token",
    "AUTH_COOKIE_REFRESH_PATH": "/api/token/refresh",
}


INSTALLED_APPS = [
    "api.apps.ApiConfig",
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    "rest_framework",
    "corsheaders",
]


MIDDLEWARE = [
    "corsheaders.middleware.CorsMiddleware",
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]


if PROD:
  CORS_ALLOWED_ORIGINS = json.loads(os.environ.get("CORS_ALLOWED_ORIGINS", "[]"))
else:
  CORS_ALLOWED_ORIGINS = [
    "http://localhost:5173",
  ]

CORS_ALLOW_CREDENTIALS = True

ROOT_URLCONF = 'workout.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'workout.wsgi.application'


# Database

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / 'db.sqlite3',
    }
}


# Password validation

AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]


# Internationalization

LANGUAGE_CODE = 'en-us'

TIME_ZONE = "America/New_York"

USE_I18N = True

USE_TZ = True

# Default primary key field type

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'
