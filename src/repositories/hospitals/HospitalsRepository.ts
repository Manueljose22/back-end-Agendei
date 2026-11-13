import { hash } from "bcrypt";
import { prismaClient } from "../../config/prisma/prismaClient";
import { hospitalInput, hospitalSave, hospitalUpdate, IHospitalsRepository } from "./IHospitalsRepository";

export class HospitalsRepository implements IHospitalsRepository {
    async create(data: hospitalInput, images: string[] = []): Promise<void> {
        const passwordHash = await hash(data.password, 12);

        await prismaClient.hospital.create({
            data: {
                name: data.name,
                address: data.address,
                phone: data.phone,
                email: data.email,
                password: passwordHash,
                nif: data.nif,
                role: data.role,
                images: {
                    create: images.map(urlImagem => ({ urlImagem }))
                }
            }
        });
    }

    async findById(id: string): Promise<hospitalSave | null> {
        return await prismaClient.hospital.findFirst({
            where: { id },
            include: {
                images: {
                    select: { urlImagem: true }
                }
            }
        });
    }

    async findByName(name: string): Promise<hospitalSave | null> {
        return await prismaClient.hospital.findFirst({
            where: { name },
            include: {
                images: {
                    select: { urlImagem: true }
                }
            }
        });
    }

    async findList(): Promise<hospitalSave[]> {
        return await prismaClient.hospital.findMany({
            include: {
                images: {
                    select: { urlImagem: true }
                }
            }
        });
    }

    async findSearch(search: string, hospitalId?: string): Promise<hospitalSave[] | null> {
        return await prismaClient.hospital.findMany({
            take: 10,
            where: {
                ...(hospitalId ? { id: hospitalId } : {}),
                OR: [
                    { name: { contains: search } },
                    { email: { contains: search } },
                    { address: { contains: search } }
                ]
            },
            include: {
                images: {
                    select: { urlImagem: true }
                }
            }
        });
    }

    async update(id: string, data: hospitalUpdate, images?: string[]): Promise<string[]> {
        return await prismaClient.$transaction(async (transaction) => {
            const previousImages = images
                ? await transaction.imagesHospitals.findMany({
                    where: { hospitalId: id },
                    select: { urlImagem: true }
                })
                : [];

            await transaction.hospital.update({
                where: { id },
                data: {
                    name: data.name,
                    address: data.address,
                    phone: data.phone,
                    email: data.email ?? undefined,
                    ...(images ? {
                        images: {
                            deleteMany: {},
                            create: images.map(urlImagem => ({ urlImagem }))
                        }
                    } : {}),
                    updatedAt: new Date()
                }
            });

            return previousImages.map(image => image.urlImagem);
        });
    }

    async delete(id: string): Promise<string[]> {
        return await prismaClient.$transaction(async (transaction) => {
            const images = await transaction.imagesHospitals.findMany({
                where: { hospitalId: id },
                select: { urlImagem: true }
            });

            await transaction.imagesHospitals.deleteMany({
                where: { hospitalId: id }
            });

            await transaction.hospital.delete({
                where: { id }
            });

            return images.map(image => image.urlImagem);
        });
    }
}
