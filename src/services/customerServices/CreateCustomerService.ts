import prismaClient from "../../prisma/index.js";

interface CreatedCustomerProps {
  name: string;
  email: string;
  userId: number;
}

class CreatedCustomerService {
  async execute({ name, email, userId }: CreatedCustomerProps) {
    const customer = await prismaClient.customer.create({
      data: {
        name,
        email,
        status: true,
        userId,
      },
    });

    return customer;
  }
}

export { CreatedCustomerService };
