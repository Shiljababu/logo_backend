export const authUser = (req, res, next) => {
  console.log("Auth check for user");

  if (!req.session.user) {
    return res.status(401).json({ message: "Unauthorized. Please log in." });
  }

  if (req.session.user.role !== "user") {
    return res.status(403).json({ message: "Access denied. Users only." });
  }

  next();
};

// export const authUser = (req, res, next) => {
//   console.log("reached")
//   if (!req.session.user) {
//     return res.status(401).json({ message: "Unauthorized. Please log in as user." });
//   }
//   next();
// };
