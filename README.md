Citylines
=========

This is the source code of [Citylines.co](http://www.citylines.co). It has a React frontend and a Sinatra API.

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
