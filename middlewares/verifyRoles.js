export const verifyRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.role) return res.sendStatus(401);
    const match = allowedRoles.includes(req.role);
    if (!match) {
      return res.status(403).json({ msg: 'Forbidden' });
    }
    next();
  };
};
