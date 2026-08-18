import { FastifyRequest, FastifyReply } from "fastify";
import { UpdateCustomerService } from "../../services/customerServices/UpdateCustomerService.js";

export class UpdateControllerCustomer {
  async handle(request: FastifyRequest, reply: FastifyReply) {
    const { id } = request.params as { id: string };
    const { name, email } = request.body as { name?: string; email?: string };

    const updateCustomer = new UpdateCustomerService();

    await updateCustomer.execute({
      id: Number(id),
      ...(name !== undefined && { name }),
      ...(email !== undefined && { email }),
    });

    reply.send("Atualizado com sucesso");
  }
}
