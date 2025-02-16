import express from "express";
import cors from "cors";
import mysql from "mysql2";
import bodyParser from "body-parser";
import "dotenv/config";

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));



const port = process.env.PORT;
app.use(cors({origin: 'http:localhost:5173'}));

const db = mysql.createConnection({
    host: 'thresholds-test.mysql.database.azure.com',
    user: 'test',
    port: 3306,
    passowrd: 'test',
    database: 'task',
});

db.connect((err) =>{
    if (err) {
        console.error('Error connecting to the database:', err);
        return;
    }
    console.log('Connected to the database');
});

app.get('/',(req, res) => {
    const query = "SELECT * FROM task;";

    db.query(query, (err, results) => {
        if (err) {
            console.log("oh no we did bad");
            console.log(err);
            res.status(500).json({error: 'Error getting tasks'})
                }
                else {
                    res.json(results);
                    
                } 
    })

})


app.post('/tasks', (req, res) => {

    const params = [req.body['title'], req.body['description'], req.body['is_completed']];
    console.log(req.body)
    const query = "INSERT INTO tasks (title, description, is_completed) VALUES (?, ?, ?);"

    db.query(query, params, (err, results) => {
        if (err) {
            console.log("oh no we did bad");
            console.log(err);
            res.status(500).json({error: 'Error adding task to database.'})
        }
        else {
            res.status(200).json(results);
        }
    })
})

app.listen(port, () => {
    console.log("Express server runing on port 3000");
})