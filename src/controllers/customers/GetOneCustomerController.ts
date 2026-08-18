import { FastifyRequest, FastifyReply } from "fastify";

import { GetOneCustomerService } from "../../services/customerServices/GetOneCustomerService.js";

export class GetOneCustomerController {
  async handle(request: FastifyRequest, reply: FastifyReply) {
    const { id } = request.params as { id: string };

    const GetOneCustomer = new GetOneCustomerService();

    const customer = await GetOneCustomer.execute({ id: Number(id) });

    reply.send(customer);
  }
}
