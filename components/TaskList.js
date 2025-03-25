import React, { useState, useEffect } from "react";
import styles from "../styles/TaskList.module.css";
import { FaPen, FaTrash, FaSave, FaTimes } from "react-icons/fa";

export default function TaskList({ tasks, setTasks }) {
  const [newTask, setNewTask] = useState("");
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editedTaskText, setEditedTaskText] = useState("");
  const [editedTaskStatus, setEditedTaskStatus] = useState("pendente");
  const [message, setMessage] = useState(null);
  const [messageType, setMessageType] = useState("success");

  const showMessage = (msg, type = "success") => {
    setMessage(msg);
    setMessageType(type);
    setTimeout(() => setMessage(null), 3000);
  };

  const fetchTasks = async () => {
    try {
      const res = await fetch("/api/tasks", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const data = await res.json();
      if (res.ok) setTasks(data);
    } catch (err) {
      showMessage("Erro ao buscar tarefas", "error");
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleAddTask = async () => {
    if (!newTask.trim()) return showMessage("Digite uma tarefa válida", "error");
    const token = localStorage.getItem("token");

    const res = await fetch("/api/tasks", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ text: newTask, status: "pendente" }),
    });

    const data = await res.json();

    if (res.ok) {
      setNewTask("");
      setTasks((prev) => [...prev, data]);
      showMessage("Tarefa adicionada com sucesso!");
    } else {
      showMessage(data.error || "Erro ao adicionar tarefa", "error");
    }
  };

  const handleDeleteTask = async (id) => {
    const token = localStorage.getItem("token");

    const res = await fetch("/api/tasks", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ id }),
    });

    if (res.ok) {
      showMessage("Tarefa excluída com sucesso!");
      fetchTasks();
    } else {
      showMessage("Erro ao excluir tarefa", "error");
    }
  };

  const handleEditTask = (task) => {
    setEditingTaskId(task.id);
    setEditedTaskText(task.text);
    setEditedTaskStatus(task.status || "pendente");
  };

  const handleSaveEdit = async () => {
    const token = localStorage.getItem("token");

    const res = await fetch("/api/tasks", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        id: editingTaskId,
        text: editedTaskText,
        status: editedTaskStatus,
      }),
    });

    if (res.ok) {
      showMessage("Tarefa atualizada com sucesso!");
      setEditingTaskId(null);
      fetchTasks();
    } else {
      showMessage("Erro ao atualizar tarefa", "error");
    }
  };

  const handleCancelEdit = () => {
    setEditingTaskId(null);
    setEditedTaskText("");
    setEditedTaskStatus("pendente");
  };

  return (
    <div className={styles.taskContainer}>
      {message && <div className={`${styles.toast} ${styles[messageType]}`}>{message}</div>}

      <h2 className={styles.title}>Gerenciador de Tarefas CF</h2>

      <div className={styles.taskInput}>
        <input
          type="text"
          placeholder="Digite uma tarefa..."
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
        />
        <button onClick={handleAddTask}>Adicionar</button>
      </div>

      <div className={styles.taskListWrapper}>
  <ul className={styles.taskList}>
    {tasks.map((task) => (
      <li key={task.id} className={styles.taskItem}>
            {editingTaskId === task.id ? (
              <>
                <input
                  type="text"
                  value={editedTaskText}
                  onChange={(e) => setEditedTaskText(e.target.value)}
                />
                <select
                  value={editedTaskStatus}
                  onChange={(e) => setEditedTaskStatus(e.target.value)}
                >
                  <option value="pendente">Pendente</option>
                  <option value="em andamento">Em andamento</option>
                  <option value="concluída">Concluída</option>
                  <option value="aguardando aprovação">Aguardando aprovação</option>
                  <option value="cancelada">Cancelada</option>
                  <option value="agendada">Agendada</option>
                </select>
                <button className={styles.iconsConfirm} onClick={handleSaveEdit}>
                  <FaSave />
                </button>
                <button className={styles.iconsDelete} onClick={handleCancelEdit}>
                  <FaTimes />
                </button>
              </>
            ) : (
              <>
                <span>{task.text}</span>
                <span>Status: <strong>{task.status}</strong></span>
                <button className={styles.iconsEdit} onClick={() => handleEditTask(task)}>
                  <FaPen />
                </button>
                <button className={styles.iconsDelete} onClick={() => handleDeleteTask(task.id)}>
                  <FaTrash />
                </button>
              </>
            )}
      </li>
    ))}
  </ul>
</div>
    </div>
  );
}
