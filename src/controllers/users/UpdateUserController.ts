import { FastifyReply, FastifyRequest } from "fastify";

import { UpdatedUserService } from "../../services/usersServices/UpdatedUserService.js";

export class UpdateUserController {
  async handle(request: FastifyRequest, reply: FastifyReply) {
    const { id } = request.params as { id: string };
    const { name, email, password } = request.body as {
      name?: string;
      email?: string;
      password?: string;
    };

    const updateUpdatedUserServiceUser = new UpdatedUserService();

    const updateUser = await updateUpdatedUserServiceUser.execute({
      id: Number(id),
      ...(name !== undefined && { name: name }),
      ...(email !== undefined && { email }),
      ...(password !== undefined && { password }),
    });
    reply.send("Atualizado com sucesso");
    return updateUser;
  }
}
