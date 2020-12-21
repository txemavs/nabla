#!/bin/sh

if [ "$DATABASE" = "postgis" ]
then
    echo "Waiting for database..."

    while ! nc -z $DB_HOST $DB_PORT; do
      sleep 0.1
    done

    echo "Django database is ready."
fi

if [ "$ENTRY" = "development" ]
then
	echo "Bootstraping Development Django..."
    python manage.py flush --no-input
	python manage.py migrate
	python manage.py createsuperuser --username=$DJANGO_SUPERUSER_USER --email=$DJANGO_SUPERUSER_EMAIL --no-input
    python manage.py createtestuser

fi


if [ "$ENTRY" = "django" ]
then
    echo "Bootstraping Django..."
    mkdir -p /usr/src/collected/static
    python manage.py collectstatic --no-input
    python manage.py flush --no-input
    python manage.py migrate
    python manage.py createsuperuser --username=$DJANGO_SUPERUSER_USER --email=$DJANGO_SUPERUSER_EMAIL --no-input
    python manage.py createtestuser

fi

exec "$@"
