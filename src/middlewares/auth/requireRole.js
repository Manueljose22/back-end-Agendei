"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireRole = void 0;
const requireRole = (...allowedRoles) => {
    return (request, response, next) => {
        const role = request.userRole;
        if (!role || !allowedRoles.includes(role)) {
            return response.status(403).json({ message: "Não tem permissões para aceder a este recurso." });
        }
        return next();
    };
};
exports.requireRole = requireRole;
