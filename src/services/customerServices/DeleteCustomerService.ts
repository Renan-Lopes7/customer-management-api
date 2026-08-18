import prisma from "../../prisma/index.js";

interface DeleteCustomerProps {
  id: number;
}

class DeleteCustomerService {
  async execute({ id }: DeleteCustomerProps) {
    if (!id) {
      throw new Error("Solicitação inválida");
    }

    const findCustomer = await prisma.customer.findFirst({ where: { id: id } });
    if (!findCustomer) {
      throw new Error("Usuário não existe");
    }
    await prisma.customer.delete({ where: { id: findCustomer.id } });

    return { msg: "Deletado com sucesso !" };
  }
}

export { DeleteCustomerService };
