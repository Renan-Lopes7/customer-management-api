import prisma from "../../prisma/index.js";

interface GetOneCustomerProps {
  id: number;
}

export class GetOneCustomerService {
  async execute({ id }: GetOneCustomerProps) {
    if (!id) {
      throw new Error("Solicitação inválida");
    }
    const customer = await prisma.customer.findFirst({ where: { id: id } });

    return customer;
  }
}
