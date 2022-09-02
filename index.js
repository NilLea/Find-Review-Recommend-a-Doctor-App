//01.09.2022 Creating an Express Server that renders (Here is the best doctor for you)
const express = require('express');
const app = express();

app.get('/', (req, res) => {
    res.send("Here is the best doctor for you");
})

app.listen(4000, () => {
    console.log("server started");
})

//01.09.2022 importing sqlite3 for our project
const sqlite3 = require('sqlite3');

//use database method in sqlite3 to connect to the database 

// Connecting Database

let db = new sqlite3.Database(":memory:", (err) => {
    if (err) {
        console.log("Error Occurred - " + err.message);
    } else {
        console.log("DataBase Connected");
    }
})