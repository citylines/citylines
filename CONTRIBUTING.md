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

- The first run, some DB extensions have to be created:

```
tools/db/create_extensions
```

- To run the server:

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

### About the assets
The js files are built, bundled and hashed by Webpack (in public/assets). From the backend, the main.js file is included in the index.erb file with the help of the webpack manifest and the webpack helpers module (basically, the webpack_asset_path helper function).
The other kinds of files, such as imgs and css, are stored in client/assets, and turned into their hashed-public versions (in public/assets/) by Sprockets. The assetPath code is isued once to add the citylines logo (hashed by Sprockets) from the frontend.
Eventually, evertyhing should be done by Webpack.
