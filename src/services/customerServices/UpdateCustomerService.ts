import prisma from "../../prisma/index.js";

interface UpdateCustomerProps {
  id: number;
  name?: string;
  email?: string;
}

export class UpdateCustomerService {
  async execute({ id, name, email }: UpdateCustomerProps) {
    if (!id) {
      throw new Error("Solitação inválida");
    }

    const customer = await prisma.customer.findFirst({
      where: { id: id },
    });

    if (!customer) {
      throw new Error("Cliente não encontrado ");
    }

    const data: { name?: string; email?: string } = {};

    if (name !== undefined) {
      if (!name) throw new Error("Campo nome não pode ser vázio");

      data.name = name;
    }
    if (email !== undefined) {
      if (!email) throw new Error("Campo e-mail não pode ser vázio");

      const checkIfEmailExist = await prisma.customer.findFirst({
        where: { email: email, id: { not: id } },
      });

      if (checkIfEmailExist) {
        throw new Error("E-mail já está em uso");
      }

      data.email = email;
    }

    if (Object.keys(data).length === 0) {
      throw new Error("Nenhum campo para atualizar");
    }

    const updateCustomer = await prisma.customer.update({
      where: { id: id },
      data,
      select: {
        id: true,
        name: true,
        email: true,
        status: true,
        created_at: true,
        updated_at: true,
      },
    });

    return updateCustomer;
  }
}
