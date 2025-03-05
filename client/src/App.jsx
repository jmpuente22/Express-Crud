import React, { useState, useEffect } from 'react';
import './App.css';
 
function App() {
  const [tasks, setTasks] = useState([]);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDescription, setNewTaskDescription] = useState('');
 
  useEffect(() => {
    fetchTasks();
  }, []);
 
  const fetchTasks = async () => {
    const response = await fetch('http://localhost:30221/tasks');
    const data = await response.json();
    setTasks(data);
  };
 
  const addTask = async () => {
    if (newTaskTitle.trim() === '') return;
 
    const response = await fetch('http://localhost:30221/tasks', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title: newTaskTitle,
        description: newTaskDescription,
        is_completed: false,
      }),
    });
 
    const data = await response.json();
    setTasks([...tasks, data]);
    setNewTaskTitle('');
    setNewTaskDescription('');
  };
 
  const editTask = async (id, updatedTask) => {
   
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === id ? { ...task, ...updatedTask } : task
      )
    );
 
    const response = await fetch(`http://localhost:30221/tasks/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedTask),
    });
 
    const data = await response.json();
    console.log('Task updated:', data);
  };
 
  const deleteTask = async (id) => {
    await fetch(`http://localhost:30221/tasks/${id}`, {
      method: 'DELETE',
    });
    setTasks(tasks.filter((task) => task.id !== id));
  };
 
  return (<>
   
    <div className="bg-blue-200 text-l border-4 border-green-500 p-4">
      <h1>To-Do List</h1>
      <div>
        <input
          type="text"
          value={newTaskTitle}
          onChange={(e) => setNewTaskTitle(e.target.value)}
          placeholder="Task Title"
        />
        <input
          type="text"
          value={newTaskDescription}
          onChange={(e) => setNewTaskDescription(e.target.value)}
          placeholder="Task Description"
        />
        <button onClick={addTask}>Add Task</button>
      </div>
      <ul>
        {tasks.map((task) => (
          <li key={task.id}>
            <input
              type="text"
              value={task.title}
              onChange={(e) =>
                editTask(task.id, {
                  title: e.target.value,
                  description: task.description,
                })
              }
            />
            <input
              type="text"
              value={task.description}
              onChange={(e) =>
                editTask(task.id, {
                  title: task.title,
                  description: e.target.value,
                })
              }
            />
            <button onClick={() => deleteTask(task.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
    </>
  );
}
 
export default App;