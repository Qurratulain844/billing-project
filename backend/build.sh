#!/usr/bin/env bash

pip install -r requirements.txt

echo "Running collectstatic..."
python manage.py collectstatic --noinput

echo "Running migrations..."
python manage.py makemigrations
python manage.py migrate

echo "Build complete"