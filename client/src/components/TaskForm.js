import { useState } from "react";
import axios from "axios";

const TaskForm = ({ refreshTasks }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post("http://localhost:5000/tasks", { title, description, completed: false })
      .then(() => {
        setTitle("");
        setDescription("");
        refreshTasks();
      })
      .catch(error => console.error("Error adding task:", error));
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="text" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} required />
      <textarea placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} required />
      <button type="submit">Add Task</button>
    </form>
  );
};

export default TaskForm;
