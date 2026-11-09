/**
 * A criação de administradores não é permitida pela API pública.
 * O primeiro administrador deve ser criado pelo script scripts/bootstrap-admin.ts.
 */
class AddAdminServices {
    async execute(_data?: unknown): Promise<never> {
        throw new Error("A criação de administradores só pode ser feita pelo processo seguro de bootstrap.");
    }
}

export { AddAdminServices };
