"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddAdminServices = void 0;
/**
 * A criação de administradores não é permitida pela API pública.
 * O primeiro administrador deve ser criado pelo script scripts/bootstrap-admin.ts.
 */
class AddAdminServices {
    async execute(_data) {
        throw new Error("A criação de administradores só pode ser feita pelo processo seguro de bootstrap.");
    }
}
exports.AddAdminServices = AddAdminServices;
