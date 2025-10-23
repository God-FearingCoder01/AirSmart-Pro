import os
import django

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'airport_api.settings')
django.setup()

from django.db import connection

# Insert the core migration record manually
with connection.cursor() as cursor:
    cursor.execute("""
        INSERT INTO django_migrations (app, name, applied) 
        VALUES ('core', '0001_initial', NOW())
    """)

print("Migration record inserted successfully!")
