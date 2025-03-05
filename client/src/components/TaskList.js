import { useState, useEffect } from "react";
import axios from "axios";

const TaskList = () => {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:5000/tasks")
      .then(response => setTasks(response.data))
      .catch(error => console.error("Error fetching tasks:", error));
  }, []);

  return (
    <div>
      <h2>To-Do List</h2>
      <ul>
        {tasks.map(task => (
          <li key={task.id}>
            {task.title} - {task.completed ? "✅" : "❌"}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TaskList;