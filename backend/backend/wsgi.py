"""
WSGI config for backend project.

It exposes the WSGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/6.0/howto/deployment/wsgi/
"""

import os

from django.core.wsgi import get_wsgi_application

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')

application = get_wsgi_application()


import os
from django.core.wsgi import get_wsgi_application

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')

# 👇 ADD THIS BLOCK
import django
django.setup()

from django.core.management import call_command

try:
    call_command('migrate', interactive=False)
except Exception as e:
    print("Migration error:", e)

# 👇 existing line
application = get_wsgi_application()