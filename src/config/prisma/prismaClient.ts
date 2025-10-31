import { PrismaClient } from '@prisma/client'



// export const prismaClient = new PrismaClient();


const globalForPrisma = global as unknown as { prisma?: PrismaClient }

export const prismaClient =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: ["query", "error", "warn"],
  })

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prismaClient
}


// reset automático só em desenvolvimento
export async function resetPrisma() {
  try {
    await prismaClient.$disconnect()
    globalForPrisma.prisma = new PrismaClient({
      log: ["query", "error", "warn"],
    })
    return globalForPrisma.prisma
  } catch (error) {
    console.error("Erro ao resetar Prisma:", error)
  }
}

