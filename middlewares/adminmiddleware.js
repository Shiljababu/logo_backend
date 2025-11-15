export const authAdmin = (req, res, next) => {
  console.log("Admin auth check");
  console.log("hgfjygdfgf",req.session);

  if (!req.session.admin) {
    return res.status(401).json({ message: "Unauthorized. Please log in." });
  }

  if (req.session.admin.role !== "admin") {
    return res.status(403).json({ message: "Access denied. Admins only." });
  }

  next();
};

