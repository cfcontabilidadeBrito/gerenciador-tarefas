import jwt from 'jsonwebtoken';

const SECRET_KEY = process.env.JWT_SECRET || 'segredo_super_secreto';

export default function verifyToken(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Token não fornecido.' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, SECRET_KEY);

    // 🔐 Anexa os dados do usuário à requisição
    req.user = {
      id: decoded.id,
      name: decoded.name,
      email: decoded.email,
      role: decoded.role,
    };

    next(); // prossegue para o próximo middleware ou handler
  } catch (error) {
    console.error('Erro na verificação do token:', error);
    return res.status(401).json({ message: 'Token inválido ou expirado.' });
  }
}
