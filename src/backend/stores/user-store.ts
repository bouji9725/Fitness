import { prisma } from "@backend/prisma/prisma";

export const userStore = {
  async findByEmail(email: string) {
    return prisma.user.findUnique({ where: { email } });
  },

  async create(email: string, passwordHash: string, name: string) {
    return prisma.user.create({ data: { email, passwordHash, name } });
  },
};
