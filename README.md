![citylines.co](https://user-images.githubusercontent.com/6061036/33101609-a6c7569a-cef7-11e7-8a49-1846b3ccf852.png)

This is the source code of [citylines.co](http://www.citylines.co), a collaborative platform where people can build the transport systems of the World's cities.

![](https://user-images.githubusercontent.com/6061036/40272543-53a12d90-5b85-11e8-88a9-787f257fd243.png)

Development [![CircleCI](https://circleci.com/gh/BrunoSalerno/citylines/tree/master.svg?style=svg)](https://circleci.com/gh/BrunoSalerno/citylines/tree/master)
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

DB
--
- Enter to the psql shell:
```
docker exec -it citylines_db_1 psql -U postgres
```

- Create the `citylines` db:
```
create database citylines;
```

- Create the role:
```
create user citylines with password 'citylines';
```

- Enter the DB:
```
\c citylines;
```

- Grant permissions:
```
grant  CREATE,CONNECT on database citylines to citylines;
```

- Create schema:
```
create schema citylines;
```

- Grant permissions to schema:
```
grant SELECT,INSERT,UPDATE on all tables in schema citylines to citylines;
```

- Create the postgis extension
```
create extension postgis;
```

- Import a dump. See instructions below.

Build!
------

```
tools/build
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
tools/local_console
```

- Re-build the frontend
```
tools/build_frontend
```

Test
====
API
---
Run
```
tools/backend_tests
```

Frontend
------
Run
```
tools/frontend_tests
```

Contact
=======

Chat with the community at [Gitter](https://gitter.im/citylines/Lobby), send an email to info at citylines.co, to me, or tweet at [@citylines_co](https://twitter.com/citylines_co).

License
=======
MIT
