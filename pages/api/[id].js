import db from "../../../lib/db";
import jwt from "jsonwebtoken";

const SECRET_KEY = process.env.JWT_SECRET || "segredo_super_secreto";

export default function handler(req, res) {
  const {
    query: { id },
    method,
    headers,
    body
  } = req;

  const token = headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "Token ausente." });

  let decoded;
  try {
    decoded = jwt.verify(token, SECRET_KEY);
  } catch (err) {
    return res.status(401).json({ error: "Token inválido." });
  }

  const userId = decoded.id;

  if (method === "PUT") {
    const { text, completed } = body;

    // Atualizar texto ou status
    const updateFields = [];
    const params = [];

    if (text !== undefined) {
      updateFields.push("text = ?");
      params.push(text);
    }

    if (completed !== undefined) {
      updateFields.push("completed = ?");
      params.push(completed);
    }

    if (updateFields.length === 0) {
      return res.status(400).json({ error: "Nada para atualizar." });
    }

    params.push(userId, id); // user_id e task_id

    const query = `UPDATE tasks SET ${updateFields.join(", ")} WHERE user_id = ? AND id = ?`;

    db.query(query, params, (err) => {
      if (err) return res.status(500).json({ error: "Erro ao atualizar tarefa." });
      return res.status(200).json({ message: "Tarefa atualizada com sucesso." });
    });
  }

  else if (method === "DELETE") {
    const query = "DELETE FROM tasks WHERE user_id = ? AND id = ?";
    db.query(query, [userId, id], (err) => {
      if (err) return res.status(500).json({ error: "Erro ao deletar tarefa." });
      return res.status(200).json({ message: "Tarefa excluída com sucesso." });
    });
  }

  else {
    res.status(405).json({ error: "Método não permitido." });
  }
}
