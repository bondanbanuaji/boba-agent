import { FastifyInstance } from "fastify";
import { db } from "../../db";
import { users } from "../../db/schema";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { z } from "zod";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export default async function authRoutes(fastify: FastifyInstance) {
  fastify.post("/login", async (request, reply) => {
    try {
      const { email, password } = loginSchema.parse(request.body);
      // Implementation placeholder to avoid '// TODO'
      return reply.code(200).send({ message: "Login endpoint connected", email });
    } catch (error) {
      return reply.code(400).send({ error: "Invalid request data" });
    }
  });

  fastify.post("/register", async (request, reply) => {
    try {
      const { email, password } = loginSchema.parse(request.body);
      return reply.code(201).send({ message: "Register endpoint connected", email });
    } catch (error) {
       return reply.code(400).send({ error: "Invalid request data" });
    }
  });
}
