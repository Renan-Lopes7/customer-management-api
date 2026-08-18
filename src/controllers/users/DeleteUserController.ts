import { FastifyRequest, FastifyReply } from "fastify";
import { DeleteUserService } from "../../services/usersServices/DeleteUserService.js";

export class DeleteUserController {
  async handle(request: FastifyRequest, reply: FastifyReply) {
    const { id } = request.params as { id: string };

    const numberId = Number(id);
    const deleteUserService = new DeleteUserService();

    const customer = await deleteUserService.execute({ id: numberId });

    reply.send(customer);
  }
}
