import dotenv from "dotenv";
dotenv.config();
import { PrismaClient } from "../generated/prisma/client.js";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";

const adapter = new PrismaMariaDb({
  host: process.env["HOST"]!,
  port: Number(process.env["PORT"]!),
  user: process.env["USER"]!,
  password: process.env["PASSWORD"]!,
  database: process.env["DB_NAME"]!,
});

const prisma = new PrismaClient({ adapter });

export default prisma;
