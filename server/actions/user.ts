import { prisma } from "../utils/prisma";
import { hashPassword, generateJWT } from "../utils/auth";

export async function registerUser(name: string, email: string, password: string) {
  // Check if user already exists
  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    return { error: "User with this email already exists." };
  }

  // Hash the password
  const hashedPassword = await hashPassword(password);

  // Create the user
  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
      role: "CUSTOMER",
    },
  });

  // Generate JWT token
  const token = generateJWT({
    userId: user.id,
    email: user.email,
    role: user.role,
  });

  return { token, user: { id: user.id, name: user.name, email: user.email, role: user.role } };
} 