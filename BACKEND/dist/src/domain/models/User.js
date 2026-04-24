"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
class User {
    id;
    nome;
    email; // Usado para autenticação (RF01) [cite: 54]
    senha; // Deve ser Bcrypt (RNF02) 
    role; // Define o que o usuário "Pode" ou "Não pode" (RF02) 
    equipeId; // Vinculo para Gerentes e Atendentes [cite: 74, 85]
    criadoEm;
}
exports.User = User;
