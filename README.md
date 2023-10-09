# :earth_americas: Countries Challenge

![Angular](https://img.shields.io/badge/angular-%23DD0031.svg?style=for-the-badge&logo=angular&logoColor=white) ![Express.js](https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB)

![demo](https://github.com/NiMusco/challenge-countries/assets/12497746/eaa94225-4cfb-479c-820a-b10fee256389)

---

## :closed_lock_with_key: Datastore:

Project is using MySQL as default datastore.\
See `config/datastores.js`:
```javascript
default: {
  adapter: 'sails-mysql',
  url: 'mysql://root@localhost:3306/challenge_countries',
},
```
Refer to [Sails :: Waterline ORM](https://sailsjs.com/documentation/reference/waterline-orm) for more info.

---

## :electric_plug: Installation

* Run `npm start` which automatically...
  	* runs `ng serve` to build and serve **Angular** on port `4200`.
  	* runs `sails lift` to lift **Express (Sails.js)** API on port `1337`. 

---

## :recycle: Cron Strategy:
Cron runs every 24hs with `node-cron`.
(every 20 seconds in this demo)

This analizes the differences between the existing data and the new one,\
updating only what is necessary **while ensuring no loss of data** during the process.

![cron](https://github.com/NiMusco/challenge-flags/assets/12497746/6149cebf-039a-4d75-a010-23e2a1be23a9)

---

## :guardsman: Security:

CORS is enabled, backend only accepts requests from `http://localhost:4200`.\
See `config/security.js`:
```javascript
cors: {
  allRoutes: true,
  allowOrigins: ["http://localhost:4200"],
  allowCredentials: true,
  allowRequestHeaders: "content-type, authorization"
}
```
---

##### Other considerations:

* Filtering by `name`, `capital`, and/or `continent` are performed **server-side**.
* Pagination and ordering are handled **client-side**.

---

:wave: That would be it.
