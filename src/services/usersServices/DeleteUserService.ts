import prisma from "../../prisma/index.js";

interface DeleteUserProps {
  id: number;
}

export class DeleteUserService {
  async execute({ id }: DeleteUserProps) {
    if (!id) {
      throw new Error("Solicitação inválida");
    }

    const findCustomer = await prisma.user.findFirst({ where: { id: id } });
    if (!findCustomer) {
      throw new Error("Usuário não existe");
    }
    await prisma.user.delete({ where: { id: findCustomer.id } });

    return { msg: "Deletado com sucesso !" };
  }
}
