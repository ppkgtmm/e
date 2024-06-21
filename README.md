# event scheduler

backend API for event scheduling and event search on particular day or week

## endpoints

endpoint url                                | function
------------------------------------------- | ----------------------------
`POST http://localhost:3000/api/event/`   | create an event
`GET http://localhost:3000/api/event/date/` | get scheduled events by date
`GET http://localhost:3000/api/event/week/` | get scheduled events by week

## getting started

- install [docker desktop](https://www.docker.com/products/docker-desktop)
- install required dependencies with following command

  ```sh
  npm install
  ```

- in project directory, create a file .env with following content

  ```sh
  USERNAME=root
  PASSWORD=12345
  HOST=localhost
  ```

- create and start mysql container

  ```sh
  docker-compose up -d
  ```

- create database inside container

  ```sh
  # replace [PASSWORD] with database password
  docker exec -it mysql mysql -u root -p[PASSWORD] -e "create database events;"
  ```

- start the backend

  ```sh
  npm run start
  ```

## testing

- run unit tests

  ```sh
  npm run test
  ```

- run integration tests

  ```sh
  npm run test:e2e
  ```

# tear down

- press `CTRL + C` to exit API server
- run the following to terminate mysql container

  ```sh
  docker-compose down -v
  ```
