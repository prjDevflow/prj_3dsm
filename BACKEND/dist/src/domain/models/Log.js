"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Log = exports.LogAction = void 0;
var LogAction;
(function (LogAction) {
    LogAction["LOGIN"] = "LOGIN";
    LogAction["CREATE"] = "CREATE";
    LogAction["UPDATE"] = "UPDATE";
    LogAction["DELETE"] = "DELETE";
})(LogAction || (exports.LogAction = LogAction = {}));
class Log {
    id;
    acao;
    entidade; // Ex: 'UTILIZADOR', 'LEAD', 'NEGOCIACAO', 'CLIENTE', 'EQUIPA'
    entidadeId; // ID do registo afetado (opcional para o caso de login)
    usuarioResponsavelId; // Quem executou a ação (RF07)
    criadoEm; // Data e hora da operação (RF07)
}
exports.Log = Log;
