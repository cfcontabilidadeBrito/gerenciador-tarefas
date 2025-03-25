import db from '../../lib/db';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const SECRET_KEY = process.env.JWT_SECRET || 'segredo_super_secreto';

export default function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido.' });
  }

  const { email, password, name, action, role } = req.body; // 👈 role agora incluso

  // Log para depuração
  console.log('📥 Requisição recebida:', req.body);

  // Validação básica
  if (!email || !password) {
    return res.status(400).json({ error: 'Email e senha são obrigatórios.' });
  }

  const cleanEmail = email.trim().toLowerCase();

  if (action === 'register') {
    db.query('SELECT * FROM users WHERE email = ?', [cleanEmail], (err, result) => {
      if (err) {
        console.error('Erro ao verificar usuário existente:', err);
        return res.status(500).json({ error: 'Erro no banco de dados.' });
      }

      if (result.length > 0) {
        return res.status(400).json({ error: 'Usuário já cadastrado.' });
      }

      const hashedPassword = bcrypt.hashSync(password, 10);

      db.query(
        'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
        [name || 'Usuário', cleanEmail, hashedPassword, role || 'pessoal'], // 👈 define 'pessoal' como padrão
        (err, result) => {
          if (err) {
            console.error('Erro ao cadastrar usuário:', err);
            return res.status(500).json({ error: 'Erro ao cadastrar usuário.' });
          }

          return res.status(201).json({ message: 'Usuário cadastrado com sucesso!' });
        }
      );
    });

  } else if (action === 'login') {
    db.query('SELECT * FROM users WHERE email = ?', [cleanEmail], (err, result) => {
      if (err || result.length === 0) {
        console.error('Usuário não encontrado ou erro no banco:', err);
        return res.status(401).json({ error: 'Usuário não encontrado.' });
      }

      const user = result[0];

      const isMatch = bcrypt.compareSync(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ error: 'Senha incorreta.' });
      }

      const token = jwt.sign(
        { id: user.id, name: user.name, email: user.email, role: user.role }, // 👈 role incluído
        SECRET_KEY,
        { expiresIn: '2h' }
      );

      return res.status(200).json({
        message: 'Login bem-sucedido!',
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role, // 👈 retornando no frontend
        },
      });
    });

  } else {
    return res.status(400).json({ error: 'Ação inválida.' });
  }
}
