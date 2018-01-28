![citylines.co](https://user-images.githubusercontent.com/6061036/33101609-a6c7569a-cef7-11e7-8a49-1846b3ccf852.png)

This is the source code of [citylines.co](http://www.citylines.co), a collaborative platform where people can build the transport systems of the World's cities.

![](https://user-images.githubusercontent.com/6061036/33101557-7865f5fe-cef7-11e7-9dce-67ae0992e900.png)

Development
===========

This repo contains the client and the API, which are built with the following technologies:
- Client: ReactJS + Mapbox GL's data-driven magic.
- API: Sinatra + Postgres/Postgis

In order to setup the development enviroment (we use [Docker](https://www.docker.com/)), the following steps are required.

Docker
------
Install Docker and docker-compose

Mapbox
------
- Create an account in Mapbox, and a base style
- Copy `/api/config/mapbox.yml.sample` to `/api/config/mapbox.yml` and fill the `access_token` and the `style` attributes

Google Auth
-----------
- Get a `google_client_id` for the Google Login from the Google console
- Copy `/api/config/auth.yml.sample` to `/api/config/auth.yml` and set the attributes. The `secret` should be a secret random string

Build!
------

```
docker-compose up --build
```

This command also runs migrations and builds the frontend (`rake db:migrate`, `yarn install` and `yarn build`).

Go to localhost:8080 and you should have Citylines running in your machine.

Other tasks
-------

- Import a dump
```
docker exec citylines_db_1 pg_restore --verbose --clean --no-acl --no-owner -U citylines -d citylines <DUMP_PATH>
```

- Connect to the local console
```
docker exec -it citylines_web_1 bundle exec rake console
```

- Re-build the frontend
```
docker exec citylines_web_1 yarn build
```

Test
====
API
---
- Create the test database in the psql command line: `create database citylines_test`
- Install postgis extension in the database: `create extension postgis`
- Run migration in the test database: `RACK_ENV=test rake db:migrate`
- To run tests:
```
rake test
```

Contact
=======

Chat with the community at [Gitter](https://gitter.im/citylines/Lobby), send an email to info at citylines.co, to me, or tweet at [@citylines_co](https://twitter.com/citylines_co).

License
=======
MIT
