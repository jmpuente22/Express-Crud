import express from 'express';
import cors from 'cors';
import mysql from 'mysql2';
import bodyParser from 'body-parser';
import 'dotenv/config';

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));



const port = 3001;
app.use(cors({ origin: 'http://localhost:5173' }));

const db = mysql.createConnection({
    host: 'thresholds-test.mysql.database.azure.com',
    user: 'jpuente',
    port: 3306,
    password: 'test',
    database: 'jpuente_tasks', 
});

db.connect((err) =>{
    if (err) {
        console.error('Error connecting to the database:', err);
        return;
    }
    console.log('Connected to the database');
});

// GET all tasks
app.get('/',(req, res) => {
    const query = "SELECT * FROM tasks;";

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

// POST: Add a new task
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

// DELETE: Remove a task
app.delete('/tasks/:id', (req, res) => {
    const { id } = req.params;
    const query = "DELETE FROM tasks WHERE id = ?;";

    db.query(query, [id], (err, result) => {
        if (err) {
            console.log("Error deleting task:", err);
            return res.status(500).json({ error: 'Error deleting task.' });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Task not found' });
        }
        res.json({ message: 'Task deleted successfully' });
    });
});
// Update an existing task (PUT replaces all fields)
app.put('/tasks/:id', (req, res) => {
    const { id } = req.params;
    const { title, description, is_completed } = req.body;
    const query = "UPDATE tasks SET title = ?, description = ?, is_completed = ? WHERE id = ?;";

    db.query(query, [title, description, is_completed, id], (err, results) => {
        if (err) {
            console.log("Error updating task", err);
            res.status(500).json({ error: 'Error updating task' });
        } else if (results.affectedRows === 0) {
            res.status(404).json({ error: 'Task not found' });
        } else {
            res.json({ message: 'Task updated successfully' });
        }
    });
});

// Partially update a task (PATCH updates only specified fields)
app.patch('/tasks/:id', (req, res) => {
    const { id } = req.params;
    const updates = req.body;
    const fields = Object.keys(updates).map(field => `${field} = ?`).join(', ');
    const values = Object.values(updates);

    if (!fields.length) {
        return res.status(400).json({ error: 'No fields to update' });
    }

    const query = `UPDATE tasks SET ${fields} WHERE id = ?;`;
    values.push(id);

    db.query(query, values, (err, results) => {
        if (err) {
            console.log("Error patching task", err);
            res.status(500).json({ error: 'Error patching task' });
        } else if (results.affectedRows === 0) {
            res.status(404).json({ error: 'Task not found' });
        } else {
            res.json({ message: 'Task patched successfully' });
        }
    });
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})