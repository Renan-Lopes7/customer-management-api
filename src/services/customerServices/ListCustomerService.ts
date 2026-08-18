import prisma from "../../prisma/index.js";
import { customerSelect } from "../../utils/CustomersPrismaSelect.js";

interface ListCustomerProps {
  page: number;
  limit: number;
  search?: string;
}

class ListCustomerService {
  async execute({ page, limit, search }: ListCustomerProps) {
    const skip = (page - 1) * limit;

    const customers = await prisma.customer.findMany({
      skip: skip,
      take: limit,
      where: search
        ? {
            OR: [
              { name: { contains: search } },
              { email: { contains: search } },
            ],
          }
        : {},
      select: customerSelect,
    });

    const totalCustomers = await prisma.customer.count({
      where: search
        ? {
            OR: [
              { name: { contains: search } },
              { email: { contains: search } },
            ],
          }
        : {},
    });

    return {
      data: customers,
      pagination: {
        page,
        limit,
        total: totalCustomers,
        totalPages: Math.ceil(totalCustomers / limit),
      },
    };
  }
}

export { ListCustomerService };
