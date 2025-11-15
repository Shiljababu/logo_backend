import bcrypt from "bcryptjs";

const hashPassword = async () => {
  const hashed = await bcrypt.hash("admin123", 10);
  console.log(hashed);
};

hashPassword();
