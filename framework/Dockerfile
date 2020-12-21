FROM python:3.9.1-alpine

WORKDIR /usr/src/framework

ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

RUN apk update && apk add postgresql-dev gcc python3-dev libffi-dev openssl-dev musl-dev gdal geos

RUN pip install --upgrade pip
RUN pip install uwsgi
COPY ./requirements.txt .
RUN pip install -r requirements.txt

COPY ./entrypoint.sh .

COPY . .

ENTRYPOINT ["/usr/src/framework/entrypoint.sh"]
