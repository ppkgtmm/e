## Description

Event Scheduler and Calendar API that allows users to enter date and time of an event, event notes and then schedule those events. Users can then browse the calendar or search the calendar for specific events on specific day or week. The app also allow to create recurring events that recur every day, week, month, year.

## API Endpoints

1. Create an event

```http
POST http://localhost:3000/api/event/
```

#### Request body

```json
{
  "date": "number",
  "month": "number",
  "year": "number",
  "start_hour": "number",
  "start_minute": "number",
  "end_hour": "number",
  "end_minute": "number",
  "notes": "string",
  "repeat_interval": "daily | weekly | monthly | yearly"
}
```

remark : event repeat interval is optional

2. Get events for a date

```http
GET http://localhost:3000/api/event/by/date/
```

#### Request body

```json
{
  "date": "number",
  "month": "number",
  "year": "number"
}
```

3. Get events for a week

```http
GET http://localhost:3000/api/event/by/week/
```

#### Request body

```json
{
  "date": "number",
  "month": "number",
  "year": "number"
}
```

## Set up

1. Install [Docker Desktop](https://www.docker.com/products/docker-desktop)

2. Run below to install required dependencies

```bash
# install required dependencies
$ npm install
```

3. At project root directory, create file .env then paste the content below to the file to help connect to database

```
USERNAME=root
PASSWORD=12345
HOST=localhost
```

4. Set up database

```bash
# create and run database container
$ docker-compose up -d
```

5. Create database inside container

```sh
# replace [PASSWORD] with database password
$ docker exec -it mysql mysql -u root -p[PASSWORD] -e "create database events;"
```

## Start app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Run tests

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```
