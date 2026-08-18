import bcrypt from "bcryptjs";
import prisma from "../../prisma/index.js";

interface UpdatedUserProps {
  id: number;
  name?: string;
  email?: string;
  password?: string;
}

export class UpdatedUserService {
  async execute({ id, name, email, password }: UpdatedUserProps) {
    if (!id) {
      throw new Error("Solicitação inválida");
    }

    const userExist = await prisma.user.findFirst({ where: { id: id } });

    if (!userExist) {
      throw new Error("Usuário não existe");
    }

    const data: { name?: string; email?: string; password?: string } = {};

    if (name !== undefined) {
      if (!name) throw new Error("Nome não pode ser vazio");
      data.name = name;
    }

    if (email !== undefined) {
      if (!email) throw new Error("E-mail não pode ser vazio");

      const checkIfEmailExist = await prisma.user.findFirst({
        where: { email: email, id: { not: id } },
      });

      if (checkIfEmailExist) throw new Error("E-mail já está em uso");

      data.email = email;
    }

    if (password !== undefined) {
      data.password = await bcrypt.hash(password, 10);
    }

    if (Object.keys(data).length === 0) {
      throw new Error("Nehumm campo para atualizar");
    }

    const updatedUser = await prisma.user.update({
      where: { id: id },
      data,
    });
    return updatedUser;
  }
}
