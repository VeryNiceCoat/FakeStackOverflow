[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-24ddc0f5d75046c5622901739e7c5dd533143b0c8e959d652212380cedb1ea36.svg)](https://classroom.github.com/a/9NDadFFr)
Add design docs in *images/*

## Instructions to setup and run project

## Team Member 1 Contribution
made profile page
made admin page
made editing functionality
more css


## Team Member 2 Contribution
Mayukh Banik
did comments, users, set up session, making accounts, splitting questions into groups of 5
handle delete account and all the related questions, etc
Made most routers in userRoute and made the user and comment schema.
added some new routers to other places.

Installation guide by Mayukh:
client:
npm install axios bycrpt express axios react
or
npm install

server:
npm install bycrypt axios cors mongoose react cookie-parser express-session
or 
npm install

Set up database:
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