import { FastifyRequest, FastifyReply } from "fastify";
import { LoginUserService } from "../../services/usersServices/LoginUserService.js";

export class LoginUserController {
  async handle(request: FastifyRequest, reply: FastifyReply) {
    const { email, password } = request.body as {
      email: string;
      password: string;
    };

    const loginUser = new LoginUserService();

    const user = await loginUser.execute({ email, password });

    const token = await reply.jwtSign({
      sub: user.id,
    });

    reply.send({ user, token });
  }
}
