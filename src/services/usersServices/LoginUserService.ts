import prisma from "../../prisma/index.js";
import bcrypt from "bcryptjs";

interface LoginUserProps {
  email: string;
  password: string;
}

export class LoginUserService {
  async execute({ email, password }: LoginUserProps) {
    if (!email) {
      throw new Error("Preencha o campo e-mail");
    }
    if (!password) {
      throw new Error("Preencha o campo de senha");
    }

    const user = await prisma.user.findFirst({
      where: { email: email },
    });

    if (!user) {
      throw new Error("E-mail ou senha incoretos.");
    }

    const comparePassword = await bcrypt.compare(password, user.password);

    if (!comparePassword) {
      throw new Error("E-mail ou senha incoretos.");
    }

    const { password: _, ...userWithoutPassword } = user;

    return userWithoutPassword;
  }
}
