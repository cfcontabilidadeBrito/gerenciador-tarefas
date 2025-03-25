import jwt from "jsonwebtoken";

// Você pode configurar essa variável de ambiente no seu .env
const SECRET_KEY = process.env.JWT_SECRET || "segredo_super_secreto";

function verifyToken(req) {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return null;

    // Verifica o token
    const decoded = jwt.verify(token, SECRET_KEY);
    return decoded; // Aqui você retorna os dados do usuário
  } catch (error) {
    return null;
  }
}

// Exportação padrão (default)
export default verifyToken;
