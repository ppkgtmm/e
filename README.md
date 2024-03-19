<!--- # event scheduler api

API which enables users to provide event date, time, and notes for scheduling purpose. Afterwards, users can search for events taking place on particular days or within specific weeks. Scheduling of events that recur every day, week, month, or year is also supported by the API -->

# endpoints

- create an event

```http
POST http://localhost:3000/api/event/
```

- get events for specified date

```http
GET http://localhost:3000/api/event/by/date/
```

- get events for specified week

```http
GET http://localhost:3000/api/event/by/week/
```

# set up

- install [docker desktop](https://www.docker.com/products/docker-desktop)
- run below to install required dependencies
```sh
npm install
```
- at project root directory, create file .env then paste the content below to the file to help connect to database
```sh
USERNAME=root
PASSWORD=12345
HOST=localhost
```
- create and start DBMS container
```sh
docker-compose up -d
```
- create database inside container
```sh
# replace [PASSWORD] with database password
docker exec -it mysql mysql -u root -p[PASSWORD] -e "create database events;"
```
- start app
```sh
npm run start
```

# testing
- run unit tests
```sh
npm run test
```
- run integration tests
```sh
npm run test:e2e
```

# tear down
- press CTRL + C to exit API server
- run below to terminate DBMS
```sh
docker-compose down
```
