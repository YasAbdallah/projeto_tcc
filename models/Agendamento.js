const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Agendamento = new Schema({
    cliente: {
        type: String,
        required: true
    },
    contatoCliente: {
        type: String,
        required: true
    },
    barbeiro: {
        type: Schema.Types.ObjectId,
        ref: "barber",
        required: true
    },
    servico: {
        type: String,
        required: true
    },
    dataAgendamento: {
        type: Date,
        required: true
    },
    horaInicio: {
        type: String,
        required: true
    },
    horaFim: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ["Agendado", "Concluído", "Cancelado", "Em Andamento"],
        default: "Agendado"
    },
    notas: {
        type: String,
        default: ""
    },
    dataCriacaoRegistro: {
        type: Date,
        default: Date.now
    }
});

mongoose.model("agendamento", Agendamento);
