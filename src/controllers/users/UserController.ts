import { FastifyRequest, FastifyReply } from "fastify";
import { CreateUserService } from "../../services/usersServices/CreateUserService.js";

export class CreateUsercontroller {
  async handle(request: FastifyRequest, reply: FastifyReply) {
    const { name, email, password } = request.body as {
      name: string;
      email: string;
      password: string;
    };

    const userSevice = new CreateUserService();

    const newUser = await userSevice.execute({ name, email, password });

    reply.send(newUser);
  }
}
