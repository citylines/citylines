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

- Generate a Google Client ID (OAuth 2.0) from the Google console. Check out the [Create authorization credentials](https://developers.google.com/identity/sign-in/web/sign-in#create_authorization_credentials) section from the docs.
- Copy `/api/config/auth.yml.sample` to `/api/config/auth.yml` and set the attributes. The `secret` may be any given string.

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

- Import a dump:
Check out the "Import a dump" task in the next section.

Note: If you haven't imported a dump, the server will be broken because migrations are not run. So you can run migrations (see below), and restart the server (`tools/run`)

### Other tasks
- Run migrations:
```
docker exec -it citylines_web_1 bundle exec rake db:migrate
```
- Import a dump
```
gunzip -c dumps/citylines_dev_anonymized.sql.gz -k | docker exec -i citylines_db_1 psql -U citylines citylines
```
Note: the `/dumps` dir of the repo is mounted automatically.

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
The other kinds of files, such as imgs and css, are stored in client/assets, and turned into their hashed-public versions (in public/assets/) by Sprockets. The AssetsProvider code is used once to add the citylines logo (hashed by Sprockets) from the frontend.
Eventually, evertyhing should be done by Webpack.

#### About the CDN
The CDN is set in the backend based on the enviroment and used there by sprockets and by the webpack helper function. It is sent to the frontend by setting `window.CDN_URL`, which is then passed to `AssetsProvider` and also used to set Webpack's `public_path` (which is done dynamically in `public-path.js`).
