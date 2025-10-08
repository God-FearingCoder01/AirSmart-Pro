import os

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.mysql',  # Use 'django.db.backends.mysql' for MySQL
        'NAME': 'airport_db',
        'USER': 'root',
        'PASSWORD': 'Oneafternoon1*',
        'HOST': 'localhost',
        'PORT': '3306',  # Default port for PostgreSQL, change to '3306' for MySQL
    }
}

ALLOWED_HOSTS = ['*'] # Adjust as needed for production

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
    "DEFAULT_AUTHENTICATION_CLASSES": (
        "rest_framework_simplejwt.authentication.JWTAuthentication"
    )
}

AUTH_USER_MODEL = "core.CustomUser"

LANGUAGE_CODE = 'en-us'

TIME_ZONE = 'UTC'

USE_I18N = True

USE_L10N = True

USE_TZ = True

STATIC_URL = '/static/'

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

# CORS_ALLOW_ALL_ORIGINS = True  # Allow all origins for CORS, adjust as needed for production

CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",  # React frontend
    "http://192.168.1.69:3000",  # React frontend
]

DEBUG = True  # Set to False in production

SECRET_KEY = os.getenv("SECRET_KEY", "qna*2_t$q)$*kj749upwngja6h@nxb2vh35+)7hzp9&#ez")
if not SECRET_KEY:
    raise ValueError("The SECRET_KEY environment variable is not set.")