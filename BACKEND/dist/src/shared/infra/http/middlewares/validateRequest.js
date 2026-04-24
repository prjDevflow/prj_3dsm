"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateRequest = void 0;
const zod_1 = require("zod");
const validateRequest = (schema) => async (req, res, next) => {
    try {
        // Valida body, query e params simultaneamente
        await schema.parseAsync({
            body: req.body,
            query: req.query,
            params: req.params,
        });
        return next();
    }
    catch (error) {
        if (error instanceof zod_1.ZodError) {
            return res.status(400).json({
                status: "error",
                message: "Falha na validação dos dados",
                // Mapeia os erros para um formato amigável ao frontend
                errors: error.issues.map((issue) => ({
                    field: issue.path.join('.'),
                    message: issue.message
                }))
            });
        }
        return res.status(500).json({ message: "Internal server error" });
    }
};
exports.validateRequest = validateRequest;
