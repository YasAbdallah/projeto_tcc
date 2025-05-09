const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Agendamento = new Schema({
    cliente: {
        type: Schema.Types.ObjectId,
        ref: "cliente",
        required: true
    },
    barbeiro: {
        type: Schema.Types.ObjectId,
        ref: "barbeiro",
        required: true
    },
    servico: {
        type: [String],
        required: true
    },
    dataAgendamento: {
        type: Date,
        required: true
    },
    horaAgendamento: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ["Agendado", "Concluído", "Cancelado", "Em Andamento"],
        default: "Agendado"
    },
    dataCriacaoRegistro: {
        type: Date,
        default: Date.now
    }
});

mongoose.model("agendamento", Agendamento);
