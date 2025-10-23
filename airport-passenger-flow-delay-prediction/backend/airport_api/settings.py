import os
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent

MYSQL_HOST = os.getenv('MYSQLHOST', os.getenv('DB_HOST', 'localhost'))
MYSQL_PORT = os.getenv('MYSQLPORT', os.getenv('DB_PORT', '3306'))
MYSQL_NAME = os.getenv('MYSQLDATABASE', os.getenv('DB_NAME', 'airport_db'))
MYSQL_USER = os.getenv('MYSQLUSER', os.getenv('DB_USER', 'root'))
MYSQL_PASSWORD = os.getenv('MYSQLPASSWORD', os.getenv('DB_PASSWORD', ''))

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.mysql',
        'NAME': MYSQL_NAME,
        'USER': MYSQL_USER,
        'PASSWORD': MYSQL_PASSWORD,
        'HOST': MYSQL_HOST,
        'PORT': MYSQL_PORT,
        'OPTIONS': {
            'init_command': "SET sql_mode='STRICT_TRANS_TABLES'",
        },
    }
}

ALLOWED_HOSTS = os.getenv('ALLOWED_HOSTS', '*').split(',')

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'rest_framework',
    'core',  # Your core app
    'corsheaders',  # For handling CORS
    'rest_framework_simplejwt',
]

MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.security.SecurityMiddleware',
    'whitenoise.middleware.WhiteNoiseMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'airport_api.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
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

WSGI_APPLICATION = 'airport_api.wsgi.application'

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

REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    ],
    'DEFAULT_PERMISSION_CLASSES': [
        'rest_framework.permissions.IsAuthenticated',
    ],
}

AUTH_USER_MODEL = "core.CustomUser"

LANGUAGE_CODE = 'en-us'

TIME_ZONE = 'UTC'

USE_I18N = True

USE_L10N = True

USE_TZ = True

STATIC_URL = '/static/'
STATIC_ROOT = os.path.join(BASE_DIR, 'staticfiles')
STATICFILES_STORAGE = 'whitenoise.storage.CompressedManifestStaticFilesStorage'

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

FRONTEND_URL = os.getenv('FRONTEND_URL')
CORS_ALLOWED_ORIGINS = [
    FRONTEND_URL,
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]
if not FRONTEND_URL:
    # Filter out None entries
    CORS_ALLOWED_ORIGINS = [o for o in CORS_ALLOWED_ORIGINS if o]

CSRF_TRUSTED_ORIGINS = [
    os.getenv('CSRF_TRUSTED_ORIGIN', ''),
]
CSRF_TRUSTED_ORIGINS = [o for o in CSRF_TRUSTED_ORIGINS if o]

DEBUG = os.getenv('DEBUG', 'False').lower() == 'true'

SECRET_KEY = os.getenv("SECRET_KEY", "qna*2_t$q)$*kj749upwngja6h@nxb2vh35+)7hzp9&#ez")
if not SECRET_KEY:
    raise ValueError("The SECRET_KEY environment variable is not set.")

# If behind a proxy (Railway), ensure SSL header recognized
SECURE_PROXY_SSL_HEADER = ('HTTP_X_FORWARDED_PROTO', 'https')