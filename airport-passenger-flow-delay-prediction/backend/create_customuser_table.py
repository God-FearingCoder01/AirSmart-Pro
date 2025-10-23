import os
import django

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'airport_api.settings')
django.setup()

from django.db import connection

# Create the core_customuser table
with connection.cursor() as cursor:
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS core_customuser (
            id BIGINT AUTO_INCREMENT PRIMARY KEY,
            password VARCHAR(128) NOT NULL,
            last_login DATETIME(6) NULL,
            is_superuser TINYINT(1) NOT NULL,
            username VARCHAR(150) NOT NULL UNIQUE,
            first_name VARCHAR(150) NOT NULL,
            last_name VARCHAR(150) NOT NULL,
            email VARCHAR(254) NOT NULL,
            is_staff TINYINT(1) NOT NULL,
            is_active TINYINT(1) NOT NULL,
            date_joined DATETIME(6) NOT NULL,
            is_approved TINYINT(1) NOT NULL DEFAULT 0
        )
    """)
    
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS core_customuser_groups (
            id BIGINT AUTO_INCREMENT PRIMARY KEY,
            customuser_id BIGINT NOT NULL,
            group_id INT NOT NULL,
            UNIQUE KEY (customuser_id, group_id),
            FOREIGN KEY (customuser_id) REFERENCES core_customuser(id),
            FOREIGN KEY (group_id) REFERENCES auth_group(id)
        )
    """)
    
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS core_customuser_user_permissions (
            id BIGINT AUTO_INCREMENT PRIMARY KEY,
            customuser_id BIGINT NOT NULL,
            permission_id INT NOT NULL,
            UNIQUE KEY (customuser_id, permission_id),
            FOREIGN KEY (customuser_id) REFERENCES core_customuser(id),
            FOREIGN KEY (permission_id) REFERENCES auth_permission(id)
        )
    """)

print("CustomUser tables created successfully!")
