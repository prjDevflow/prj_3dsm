"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Lead = exports.LeadStatus = void 0;
var LeadStatus;
(function (LeadStatus) {
    LeadStatus["NOVO"] = "NOVO";
    LeadStatus["EM_ATENDIMENTO"] = "EM_ATENDIMENTO";
    LeadStatus["FINALIZADO"] = "FINALIZADO";
})(LeadStatus || (exports.LeadStatus = LeadStatus = {}));
class Lead {
    id;
    clienteId;
    atendenteId; // RF02
    lojaId;
    origem;
    criadoEm;
    gerenteResponsavelId;
}
exports.Lead = Lead;
