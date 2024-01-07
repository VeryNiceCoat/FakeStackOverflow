Requires MongoDB

Installation:
cd to the client folder and run the following command:
npm install axios bycrpt express axios react
or
npm install

cd to the server folder and run the following command:
npm install bycrypt axios cors mongoose react cookie-parser express-session
or 
npm install

To set up the database:
In server folder run
node init.js [adminEmail] [admingPassword]
By default it is:
node init.js admin@admin.com admin
Data will be stored in fake_so.
Mongodb and Mongosh should be running, and defualt mongo server is assumed, it is hardcoded so change it if you want

Client side:
npm start

Server side
nodemon server.js
