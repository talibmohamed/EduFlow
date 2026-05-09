import jwt from 'jsonwebtoken';

const authError = { success: false, message: 'Authentication required' };

export function requireAuth(req, res, next) {
  const header = req.get('Authorization');

  if (!header || !header.startsWith('Bearer ')) {
    return res.status(401).json(authError);
  }

  const token = header.slice('Bearer '.length).trim();

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { id: payload.id, role: payload.role };
    return next();
  } catch {
    return res.status(401).json(authError);
  }
}

export function requireRole(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ success: false, message: 'Forbidden' });
    }

    return next();
  };
}
