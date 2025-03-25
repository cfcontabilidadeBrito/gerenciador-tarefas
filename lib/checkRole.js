export function checkRole(allowedRoles) {
    return function (req, res, next) {
      const user = req.user;
  
      if (!user || !allowedRoles.includes(user.role)) {
        return res.status(403).json({ message: 'Acesso negado: permissão insuficiente.' });
      }
  
      next(); // prossegue para o handler se permitido
    };
  }
  