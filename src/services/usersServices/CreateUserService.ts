import prisma from "../../prisma/index.js";
import { userSelect } from "../../utils/UsersPrismaSelect.js";
import bcrypt from "bcryptjs";

interface CreateUserProps {
  name: string;
  email: string;
  password: string;
}

export class CreateUserService {
  async execute({ name, email, password }: CreateUserProps) {
    if (!name) {
      throw new Error("Campo nome Obrigatório");
    }
    if (!email) {
      throw new Error("Campo e-mail Obrigatório");
    }
    if (!password) {
      throw new Error("Campo senha Obrigatório");
    }

    const userExist = await prisma.user.findFirst({ where: { email: email } });

    if (userExist) {
      throw new Error("Este e-mail já está em uso.");
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password: passwordHash,
      },
      select: userSelect,
    });

    return newUser;
  }
}
