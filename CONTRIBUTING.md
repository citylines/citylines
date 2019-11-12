# Contributing

## Improving or adding data

You can start improving or adding new data from our online editor right now.
Go to [citylines.co](https://www.citylines.co), choose a city and start editing!

## Development

This repo contains the client and the API, which are built with the following technologies:
- Client: ReactJS + Mapbox GL's data-driven magic.
- API: Sinatra + Postgres/Postgis

In order to setup the development enviroment (we use [Docker](https://www.docker.com/)), the following steps are required.

### Docker

Install Docker and docker-compose

### Mapbox

- Create an account in Mapbox, and a base style
- Copy `/api/config/mapbox.yml.sample` to `/api/config/mapbox.yml` and fill the `access_token` and the `style` attributes

### Google Auth

- Get a `google_client_id` for the Google Login from the Google console
- Copy `/api/config/auth.yml.sample` to `/api/config/auth.yml` and set the attributes. The `secret` should be a secret random string

### Building

- To build the backend (and run it):
```
tools/build
```

- To simply run it:

```
tools/run
```

- To build the frontend:
```
tools/build_frontend
```

Go to localhost:8080 and you should have Citylines running in your machine.
If you are using Docker Toolbox, the host will probably be something like 192.168.99.100.

Note: Probably in the first run, the server will be broken because migrations are not run. So you can run migrations (see below), and restart the server (`tools/run`)

### Other tasks
- Run migrations:
```
docker exec -it citylines_web_1 bundle exec rake db:migrate
```
- Import a dump
```
docker exec citylines_db_1 pg_restore --verbose --clean --no-acl --no-owner -U citylines -d citylines <DUMP_PATH>
```

- Connect to the local console
```
tools/local_console
```

- Load some cities:

```
docker exec -it -e FILENAME=tools/load_cities/infoplease_cities_formatted.csv citylines_web_1 bundle exec ruby tools/load_cities/load.rb
```
### Testing

#### API

Run
```
tools/backend_tests
```

#### Frontend
Run
```
tools/frontend_tests
```
