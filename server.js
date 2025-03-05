import express from 'express';
import cors from 'cors';
import mysql from 'mysql2';
import bodyParser from 'body-parser';
import 'dotenv/config';
 
const app = express(); // this calls the express function
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
 
const port = process.env.PORT || 30221;  // Use the correct environment variable name
 app.use(cors({origin: 'http://localhost:30221'}));
 
 
const db = mysql.createConnection({
    host: 'thresholds-test.mysql.database.azure.com',
    user: 'jpuente', // Replace with your MySQL username
    port: 3306, // Replace with the port you need - may be different from mine
    password: 'test', // Replace with your MySQL password
    database: 'jpuente_tasks', // Replace with your database name
});
 
db.connect((err) => {
    if (err) {
        console.error('Failed to connect to the database please check your code:', err);
        return;
    }
    console.log('You just got connected to the database, welcome to Jozelyn info');
});
 
app.get('/', (req, res) => {
    res.send('Yes its working');
});
 
app.get('/users', (req, res) => {
    res.send('Users page');
    console.log('Users page');
});
 
app.get('/tasks', (req, res) => {
    const query = 'SELECT * FROM tasks';
    db.query(query, (err, results) => {
        if (err) {
            console.error('could not pull up the tasks:', err);
            console.log('You did something wrong with the tasks');
            res.status(500).json({ error: 'Error retrieving tasks' });
        } else {
            console.log(results[0]);
            res.json(results);
        }
    });
});

 
 
 
 
 
 
 
 
app.post('/tasks', (req, res) => {
    const parmas = [req.body['title'], req.body['description'], req.body['is_completed']];
    const query = 'INSERT INTO tasks (title, description, is_completed) VALUES(?, ?, ?);'
    db.query(query, parmas, (err, results) => {
        if (err) {
            console.error('could not insert the task:', err);
            console.log('could not add the task');
            res.status(500).json({ error: 'Error inserting task' });
        } else {
            console.log(results);
            res.json({ message: 'Task inserted successfully' });
            res.status(200);
        }
    });
 
})
 
// app.put('/tasks/:id', (req, res) => {
//     const { id } = req.params;
//     const { title, description, is_completed } = req.body;
 
//     if (!title || !description || is_completed === undefined) {
//         return res.status(400).json({ error: 'All fields (title, description, is_completed) are required' });
//     }
 
//     const query = 'UPDATE tasks SET title = ?, description = ?, is_completed = ? WHERE id = ?';
//     const params = [title, description, is_completed, id];
 
//     db.query(query, params, (err, results) => {
//         if (err) {
//             console.error('Error updating task:', err);
//             return res.status(500).json({ error: 'Error updating task' });
//         }
//         if (results.affectedRows === 0) {
//             return res.status(404).json({ error: 'Task not found' });
//         }
//         res.json({ message: 'Task updated successfully' });
//     });
// });
 
app.put('/tasks/:id', (req, res) => {
    const taskId = parseInt(req.params.id, 10); // Ensure ID is an integer
    const { title, description, is_completed } = req.body;
 
    // Debugging: Log the ID and received data
    console.log("Updating task with ID:", taskId);
    console.log("Received data:", req.body);
 
    // Validate input
    if (!title || !description || is_completed === undefined) {
        return res.status(400).json({ error: 'All fields (title, description, is_completed) are required' });
    }
 
    const query = 'UPDATE tasks SET title = ?, description = ?, is_completed = ? WHERE id = ?';
    const params = [title, description, is_completed, taskId];
 
    db.query(query, params, (err, results) => {
        if (err) {
            console.error('Error updating task:', err);
            return res.status(500).json({ error: 'Error updating task' });
        }
 
        console.log("MySQL Results:", results); // Debugging line
 
        if (results.affectedRows === 0) {
            return res.status(404).json({ error: 'Task not found' });
        }
 
        res.json({ message: 'Task updated successfully' });
    });
});
 
app.delete('/tasks/:id', (req, res) => {
    const taskId = req.params.id; // Get ID from URL parameter
 
    const query = "DELETE FROM tasks WHERE id = ?";
 
    db.query(query, [taskId], (err, results) => {
        if (err) {
            console.error("Error deleting task:", err);
            return res.status(500).json({ error: "Error deleting task." });
        }
        res.status(200).json({ message: "Task deleted successfully" });
    });
});
 
 
 
app.listen(port, () => {
    console.log('Express working girl');
});