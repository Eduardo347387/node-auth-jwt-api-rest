import { PrismaClient } from "@prisma/client";
const primas = new PrismaClient();
export default primas.user;