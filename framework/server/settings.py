
import os
from pathlib import Path

SITE_ID = 1
ALLOWED_HOSTS = "*"

BASE_DIR = Path(__file__).resolve().parent.parent
ROOT_DIR = BASE_DIR.parent
STATIC_URL = '/static/'
STATIC_ROOT = ROOT_DIR / 'collected' / 'static'
STATICFILES_DIRS = (BASE_DIR / 'static',)

WSGI_APPLICATION = 'server.wsgi.application'
ASGI_APPLICATION = 'server.routing.application'

ROOT_URLCONF = 'server.urls'
APPEND_SLASH = False

SECRET_KEY = os.environ.get('DJANGO_SECRET_KEY', None)
if SECRET_KEY is None:

    if os.path.exists(BASE_DIR / '.secret'):
        with open('.secret', 'r') as f: SECRET_KEY=f.read()
        print("Django settings: Secret from file!")
    else:
        from django.core.management.utils import get_random_secret_key
        SECRET_KEY = get_random_secret_key()
        with open('.secret', 'w') as f: f.write(SECRET_KEY)
        print("WARNING: Django random secret saved to file! Please set DJANGO_SECRET_KEY")


DEBUG = os.environ.get('DJANGO_DEBUG', True)

DATABASES = {
    'default': {
        'ENGINE': os.environ.get('DB_ENGINE'),
        'HOST': os.environ.get('DB_HOST'),
        'PORT': os.environ.get('DB_PORT'),
        'NAME': os.environ.get('POSTGRES_DB'),
        'USER': os.environ.get('POSTGRES_USER'),
        'PASSWORD': os.environ.get('POSTGRES_PASSWORD'),
        
    }
}

GDAL_LIBRARY_PATH='/usr/lib/libgdal.so.27'
GEOS_LIBRARY_PATH='/usr/lib/libgeos_c.so.1'



SERVER_EMAIL = os.environ.get('DJANGO_SERVER_EMAIL')
DEFAULT_FROM_EMAIL = os.environ.get('DJANGO_DEFAULT_FROM_EMAIL')
EMAIL_BACKEND = os.environ.get('DJANGO_EMAIL_BACKEND')
if EMAIL_BACKEND=='gmailapi_backend.mail.GmailBackend':
    GMAIL_API_CLIENT_ID = os.environ.get('DJANGO_GMAIL_API_CLIENT_ID')
    GMAIL_API_CLIENT_SECRET = os.environ.get('DJANGO_GMAIL_API_CLIENT_SECRET')
    GMAIL_API_REFRESH_TOKEN = os.environ.get('DJANGO_GMAIL_API_REFRESH_TOKEN')

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'django.contrib.sites',
    'django.contrib.gis',
    'django_extensions',
    'allauth',
    'allauth.account',
    'allauth.socialaccount',
    'allauth.socialaccount.providers.google',
    'gmailapi_backend',
    'rest_framework',
    'channels',
    'nabla',
]

CHANNEL_LAYERS = {
    'default': {
        'BACKEND': 'channels_redis.core.RedisChannelLayer',
        'CONFIG': {
            "hosts": [(os.environ.get('REDIS_HOST'), 6379)],
        },
    },
}


REST_FRAMEWORK = {
    'DEFAULT_PAGINATION_CLASS': 'rest_framework.pagination.LimitOffsetPagination',
}


MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]


TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [
            BASE_DIR / "templates",
        ],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]



AUTHENTICATION_BACKENDS = (
    'django.contrib.auth.backends.ModelBackend',
    'allauth.account.auth_backends.AuthenticationBackend',
)

AUTH_PASSWORD_VALIDATORS = [
    { 'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',},
    { 'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',},
    { 'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',},
    { 'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',},
]

LOGIN_REDIRECT_URL = '/'

SOCIALACCOUNT_PROVIDERS = {
    'google': {
        'SCOPE': [
            'profile',
            'email',
        ],
        'AUTH_PARAMS': {
            'access_type': 'online',
        }
    },
}


# Internationalization
# https://docs.djangoproject.com/en/3.1/topics/i18n/

LANGUAGE_CODE = 'en-us'

TIME_ZONE = 'UTC'

USE_I18N = True

USE_L10N = True

USE_TZ = True
