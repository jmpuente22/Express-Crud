import axios from "axios";

const TaskItem = ({ task, refreshTasks }) => {
  const toggleComplete = () => {
    axios.put(`http://localhost:5000/tasks/${task.id}`, { ...task, completed: !task.completed })
      .then(refreshTasks)
      .catch(error => console.error("Error updating task:", error));
  };
  const deleteTask = () => {
    axios.delete(`http://localhost:5000/tasks/${task.id}`)
      .then(refreshTasks)
      .catch(error => console.error("Error deleting task:", error));
  };
  

  return (
    <li>
      <span>{task.title} - {task.completed ? "✅" : "❌"}</span>
      <button onClick={toggleComplete}>{task.completed ? "Undo" : "Complete"}</button>
      <button onClick={deleteTask}>🗑 Delete</button>
    </li>
  );
};

export default TaskItem;
