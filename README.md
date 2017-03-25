Citylines
=========

This is the source code of [Citylines.co](http://www.citylines.co). This repo includes the client (built with React JS) and the API (A Sinatra app).

Development
===========
Database
--------
- Install Postgres 9.5
- Create the database, user and password listed in `api/config/databases.yml.sample` under the `development` category
- Install the Postgis extension in the database created: `create extension postgis` from the psql command line
- Copy the file `/api/config/database.yml.sample`to `/api/config/database.yml`

Mapbox
------
- Create an account in Mapbox, and a base style
- Copy `/api/config/mapbox.yml.sample` to `/api/config/mapbox.yml` and fill the `access_token` and the `style` attributes

Google Auth
-----------
- Get a `google_client_id` for the Google Login from the Google console
- Copy `/api/config/auth.yml.sample` to `/api/config/auth.yml` and set the attributes. The `secret` should be a secret random string

API
---
- Install Ruby 2.3
- Install `bundle` gem
- Install dependencies: `bundle install`
- Run migrations: `rake db:migrate`
- Start the server: `rackup`

Client
------
- Install Node 7
- Install npm
- Install dependencies: `npm install`
- Build: `npm run build`

Go to localhost:9292 and you should have Citylines running in your machine.

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
