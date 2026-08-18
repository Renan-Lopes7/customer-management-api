import { FastifyRequest, FastifyReply } from "fastify";
import { DeleteCustomerService } from "../../services/customerServices/DeleteCustomerService.js";

export class DeleteCustomerController {
  async handle(request: FastifyRequest, reply: FastifyReply) {
    const { id } = request.params as { id: string };
    const numberId = Number(id);
    const customerServices = new DeleteCustomerService();

    const customer = await customerServices.execute({ id: numberId });

    reply.send(customer);
  }
}
