# event scheduler api

API which enables users to provide event date, time, and notes for scheduling purpose. Afterwards, users can search for events taking place on particular days or within specific weeks. Scheduling of events that recur every day, week, month, or year is also supported by the API
## API endpoints

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
  "repeat_interval": "string"
}
```

remarks : event repeat interval is optional with following possible values : daily, weekly, monthly and yearly

2. Get events for specified date

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

3. Get events for specified week

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
npm install
```

3. At project root directory, create file .env then paste the content below to the file to help connect to database

```
USERNAME=root
PASSWORD=12345
HOST=localhost
```

4. Create and start DBMS container

```bash
docker-compose up -d
```

5. Create database inside container

```sh
# replace [PASSWORD] with database password
docker exec -it mysql mysql -u root -p[PASSWORD] -e "create database events;"
```

## Start app

```bash
# development mode
npm run start

# watch mode
npm run start:dev

# production mode
npm run start:prod
```

## Run tests

```bash
# unit tests
npm run test

# e2e tests
npm run test:e2e

# test coverage
npm run test:cov
```
