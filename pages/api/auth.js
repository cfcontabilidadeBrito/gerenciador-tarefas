import db from '../../lib/db';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const SECRET_KEY = process.env.JWT_SECRET || "segredo_super_secreto"; // defina no .env depois

export default function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido.' });
  }

  const { email, password, name, action } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email e senha são obrigatórios.' });
  }

  if (action === 'register') {
    // Verificar se usuário já existe
    db.query("SELECT * FROM users WHERE email = ?", [email], (err, result) => {
      if (err) return res.status(500).json({ error: 'Erro no banco.' });
      if (result.length > 0) return res.status(400).json({ error: 'Usuário já existe.' });

      // Criptografar senha
      const hashedPassword = bcrypt.hashSync(password, 10);

      const insert = 'INSERT INTO users (name, email, password) VALUES (?, ?, ?)';
      db.query(insert, [name || "Usuário", email, hashedPassword], (err, result) => {
        if (err) return res.status(500).json({ error: 'Erro ao cadastrar usuário.' });
        return res.status(201).json({ message: 'Usuário cadastrado com sucesso!' });
      });
    });

  } else if (action === 'login') {
    // Buscar usuário
    db.query("SELECT * FROM users WHERE email = ?", [email], (err, result) => {
      if (err || result.length === 0) {
        return res.status(401).json({ error: 'Usuário não encontrado.' });
      }

      const user = result[0];

      // Comparar senha
      const isMatch = bcrypt.compareSync(password, user.password);
      if (!isMatch) return res.status(401).json({ error: 'Senha incorreta.' });

      // Gerar token
      const token = jwt.sign(
        { id: user.id, name: user.name, email: user.email },
        SECRET_KEY,
        { expiresIn: '2h' }
      );

      return res.status(200).json({
        message: 'Login bem-sucedido!',
        token,
        user: { id: user.id, name: user.name, email: user.email }
      });
    });

  } else {
    return res.status(400).json({ error: 'Ação inválida.' });
  }
}
