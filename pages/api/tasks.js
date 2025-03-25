import db from "../../lib/db";
import authMiddleware from "../../lib/authMiddleware";

const allowedStatuses = [
  "pendente",
  "em andamento",
  "concluída",
  "aguardando aprovação",
  "cancelada",
  "agendada"
];

export default async function handler(req, res) {
  const user = await authMiddleware(req, res);
  if (!user) return;

  if (req.method === "GET") {
    db.query("SELECT * FROM tasks WHERE user_id = ? ORDER BY created_at DESC", [user.id], (err, results) => {
      if (err) return res.status(500).json({ error: "Erro ao buscar tarefas" });
      return res.status(200).json(results);
    });
  } 
  else if (req.method === "POST") {
    const { text, status = "pendente" } = req.body;
    if (!text || !allowedStatuses.includes(status)) {
      return res.status(400).json({ error: "Texto ou status inválido." });
    }
    db.query(
      "INSERT INTO tasks (user_id, text, status) VALUES (?, ?, ?)",
      [user.id, text, status],
      (err, result) => {
        if (err) return res.status(500).json({ error: "Erro ao adicionar tarefa" });
        const novaTarefa = {
          id: result.insertId,
          user_id: user.id,
          text,
          status,
          created_at: new Date()
        };
        return res.status(201).json(novaTarefa);
      }
    );
  } 
  else if (req.method === "PUT") {
    const { id, status, text } = req.body;

    if (!id) return res.status(400).json({ error: "ID da tarefa não fornecido" });

    let updateFields = [];
    let values = [];

    if (typeof text !== "undefined") {
      updateFields.push("text = ?");
      values.push(text);
    }

    if (typeof status !== "undefined" && allowedStatuses.includes(status)) {
      updateFields.push("status = ?");
      values.push(status);
    }

    if (updateFields.length === 0) {
      return res.status(400).json({ error: "Nenhum campo válido fornecido para atualização" });
    }

    values.push(id, user.id);
    const sql = `UPDATE tasks SET ${updateFields.join(", ")} WHERE id = ? AND user_id = ?`;
    db.query(sql, values, (err) => {
      if (err) return res.status(500).json({ error: "Erro ao atualizar tarefa" });
      return res.status(200).json({ message: "Tarefa atualizada com sucesso" });
    });
    
  } else if (req.method === "DELETE") {
    const { id } = req.body;
    if (!id) return res.status(400).json({ error: "ID da tarefa não fornecido" });
  
    await db.promise().query("DELETE FROM tasks WHERE id = ?", [id]);
    return res.status(200).json({ message: "Tarefa excluída com sucesso" });
  }
  
  else {
    return res.status(405).json({ error: "Método não permitido" });
  }
}
