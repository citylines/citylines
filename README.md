![citylines.co](https://user-images.githubusercontent.com/6061036/33101609-a6c7569a-cef7-11e7-8a49-1846b3ccf852.png)

This is the source code of [citylines.co](http://www.citylines.co), a collaborative platform where people can build the transport systems of the World's cities.

General view
![](https://user-images.githubusercontent.com/6061036/33101557-7865f5fe-cef7-11e7-9dce-67ae0992e900.png)

Editor
![](https://user-images.githubusercontent.com/6061036/33101524-579f3a42-cef7-11e7-9193-7288b51b3b4f.png)

Development
===========

This repo contains the client and the API, which are built with the following technologies:
- Client: ReactJS + Mapbox GL's data-driven magic.
- API: Sinatra + Postgres/Postgis

In order to setup the development enviroment, the following steps are required.

Database
--------
- Install Postgres 9.5
- Create the database, user and password listed in `api/config/databases.yml.sample` under the `development` category:
  - `create database <db_name>;`
  - `create user <user_name>;`
  - `alter user <user_name> with password '<password>';`
- You have also to create a schema and grant the right privileges:
  - `\c <db_name>`;
  - `grant  CREATE,CONNECT on database <db_name> to <user_name>;`
  - `create schema <a_schema_name>;`
  - `grant SELECT,INSERT,UPDATE on all tables in schema <a_schema_name> to <user_name>;`
- Install the Postgis extension in the database created: `create extension postgis`;`
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
- Install node and yarn
- Install dependencies: `yarn install`
- Build: `yarn build`

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

Contact
=======

Chat with the community at [Gitter](https://gitter.im/citylines/Lobby), send an email to info at citylines.co or tweet at [@citylines_co](https://twitter.com/citylines_co). Of course, you can also contact *me*.

License
=======
MIT
