var express = require('express');
var router = express.Router();
var fs = require("fs");

let serverDataArray = [];

let fileManager = {
    read: function () {
        var rawdata = fs.readFileSync('objectdata.json');
        if (rawdata.length > 0) {
            serverDataArray = JSON.parse(rawdata);
        }
    },

    write: function () {
        let data = JSON.stringify(serverDataArray);
        fs.writeFileSync('objectdata.json', data);
    },

    validData: function () {
        var rawdata = fs.readFileSync('objectdata.json');
        return rawdata.length > 0;
    }
};

/* GET home page. */
router.get('/', function (req, res, next) {
    res.sendFile('index', { title: 'Nutrition App' });
});

// get all nutrition data
router.get('/getCurrentNutrition', function (req, res) {
    fileManager.read();
    res.status(200).json(serverDataArray.filter(item => item.nutritionDate));
});

// get all workout data
router.get('/getCurrentWorkout', function (req, res) {
    fileManager.read();
    res.status(200).json(serverDataArray.filter(item => item.workoutDate));
});

// Add new workout data
router.post('/saveWorkout', function (req, res) {
    const newWorkout = req.body;
    serverDataArray.push(newWorkout);
    fileManager.write();
    res.sendStatus(200);
});

// Add new nutrition data
router.post('/saveNutrition', function (req, res) {
    const newNutrition = req.body;
    serverDataArray.push(newNutrition);
    fileManager.write();
    res.sendStatus(200);
});

module.exports = router;
