import { FastifyRequest, FastifyReply } from "fastify";
import { ListCustomerService } from "../../services/customerServices/ListCustomerService.js";

export class ListCustomersController {
  async handle(request: FastifyRequest, reply: FastifyReply) {
    const { page, limit, search } = request.query as {
      page?: string;
      limit?: string;
      search?: string;
    };
    const listCustomerService = new ListCustomerService();

    const customers = await listCustomerService.execute({
      page: Number(page || 1),
      limit: Number(limit || 10),
      ...(search !== undefined && { search }),
    });

    reply.send(customers);
  }
}
