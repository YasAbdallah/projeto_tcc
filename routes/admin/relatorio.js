const express = require('express')
const router = express.Router()
const mongoose = require("mongoose")
const PdfPrinter = require("pdfmake")
const fs = require('fs')
require('../models/Solicitacao')
const Solicitacao = mongoose.model('solicitacao')
require('../models/ListaSolicitacaoUsuario')
const ListaSolicitacaoUsuario = mongoose.model('listaSolicitacaoUsuario')
require('../models/Setor')
const Setor = mongoose.model('setor')
require('../models/Usuario')
const Usuario = mongoose.model('usuario')
require('../models/Produto')
const Produto = mongoose.model('produtos')
const {admin} = require("../helpers/verificarlogin")
const {paginacao} = require("../helpers/paginacao")
const {formatarData, formatarDataBd, trocarOrdemData} = require("../helpers/funcoes")

router.get("/relatorio", admin, async (req, res) => {
    try{
        const pagina = req.query.pag || 1
        const itensPorPagina = req.query.itensPorPagina || 15
        const limite = itensPorPagina == undefined || itensPorPagina == 0 ? 15 : Number(itensPorPagina)
        const indiceItemPagina = (pagina - 1) * limite

        //Buscar os produtos paginados
        const solicitacao = await Solicitacao.find().skip(indiceItemPagina).limit(limite).sort({'produto': 'ASC'}).populate(['usuario', 'setor'])
        
        //capturando total de itens no BD
        const totalItens = await Solicitacao.countDocuments()
        //Calculando Paginação
        const paginas = paginacao('/admin/relatorio', pagina, limite, totalItens)
        res.render('admin/relatorio/index', {solicitacao, paginas})
    }catch(error){
        req.flash("error_msg", "Houve um erro ao tentar carregar os dados.")
        res.redirect("/")
    }
})

router.get("/relatorio/search", admin, async (req, res) => {
    try{
        const pagina = req.query.pag || 1
        const itensPorPagina = req.query.itensPorPagina || 15
        const limite = itensPorPagina == undefined || itensPorPagina == 0 ? 15 : Number(itensPorPagina)
        const indiceItemPagina = (pagina - 1) * limite

        
        const dataInicial = req.query.dataInicial.split(' ')[0].split('-')
        const dataFinal = req.query.dataFinal.split(' ')[0].split('-')
        const novaDataFinal = new Date(dataFinal[0], dataFinal[1] - 1, dataFinal[2], 19)

        //Buscar os produtos paginados
        const solicitacao = await Solicitacao.find().where('data').lte(Date.parse(novaDataFinal)).gte(Date.parse(dataInicial))
        .skip(indiceItemPagina)
        .limit(limite)
        .sort({'produto': 'ASC'})
        .populate(['usuario', 'setor'])
        
        //capturando total de itens no BD
        const totalItens = await Solicitacao.countDocuments()
        .where('data')
        .lte(Date.parse(novaDataFinal))
        .gte(Date.parse(dataInicial))
        //Calculando Paginação
        const paginas = paginacao('/admin/relatorio', pagina, limite, totalItens)
        res.render('/admin/relatorio/index', {solicitacao, paginas})

    }catch(error){
        req.flash("error_msg", "Houve um erro ao tentar carregar os dados.")
        res.redirect("/")
    }
})

router.get("/relatorio/gerar", admin, async (req, res) => {
    //TODO: Arrumar a ageração de relatório
    let fonts = {
        Courier: {
          normal: 'Courier',
          bold: 'Courier-Bold',
          italics: 'Courier-Oblique',
          bolditalics: 'Courier-BoldOblique'
        },
        Helvetica: {
          normal: 'Helvetica',
          bold: 'Helvetica-Bold',
          italics: 'Helvetica-Oblique',
          bolditalics: 'Helvetica-BoldOblique'
        },
        Times: {
          normal: 'Times-Roman',
          bold: 'Times-Bold',
          italics: 'Times-Italic',
          bolditalics: 'Times-BoldItalic'
        },
        Symbol: {
          normal: 'Symbol'
        },
        ZapfDingbats: {
          normal: 'ZapfDingbats'
        }
    };


    try{
        const pagina = req.query.pag || 1
        const itensPorPagina = req.query.itensPorPagina || 15
        const limite = itensPorPagina == undefined || itensPorPagina == 0 ? 15 : Number(itensPorPagina)
        const indiceItemPagina = (pagina - 1) * limite
        const dataInicial = req.query.dataInicial.split(' ')[0].split('-')
        const dataFinal = req.query.dataFinal.split(' ')[0].split('-')
        const novaDataFinal = new Date(dataFinal[0], dataFinal[1] - 1, dataFinal[2], 19)

        //Buscar os produtos paginados
        const solicitacao = await Solicitacao.find()
        .where('data').lte(Date.parse(novaDataFinal)).gte(Date.parse(dataInicial))
        .sort({'produto': 'ASC'}).populate(['usuario', 'setor'])
        
        //capturando total de itens no BD
        const totalItens = await Solicitacao.countDocuments().where('data').lte(Date.parse(novaDataFinal)).gte(Date.parse(dataInicial))

        if(totalItens === 0){
            req.flash('error_msg', `Não foi encontrado nenhum registro entre ${formatarData(req.query.dataInicial.split(' ')[0])} à ${formatarData(req.query.dataFinal.split(' ')[0])}.`)
            res.redirect("/admin/relatorio")
        }else{
            let listaRelatorio = []
            const cabecalho = ["Solicitante", "Setor", "Código", "Produto", "Quantidade", "Data da solicitação"]
            solicitacao.map(elem => {
                listaRelatorio.push([elem.usuario.nome, elem.setor.sigla, elem.codigo, elem.produto, elem.qnt, formatarDataBd(elem.data)])
            })
            const docDefinition = {
                pageSize:"A4",
                pageOrientation:"landscape",
                content: [
                    /*{
                        image: '../cabecalho.jpg'
                    },*/
                    //Cabeçalho do PDF
                    {
                        text: "SGSA - Relatórios.",
                        style: 'header',
                        alignment: "center",
                        fontSize: 24,
                        bold: true,
                        margin: [0, 10]
                    },
                    //Primeira table
                    {
                        margin: [0, 0, 0, 10],
                        layout: {
                            fillColor: (rowIndex, node, columnIndex) => (rowIndex % 2 === 0) ? '#ebebeb' : '#f5f5f5'
                        },
                        table: {
                            widths: ["100%"],
                            heights: [20, 10],
                            body: [
                                [
                                    {
                                        text: `SETOR EMISSOR:  ${sigla.map(elem => elem.sigla)[0]}`,
                                        fontSize: 9,
                                        bold: true
                                    }
                                ],
                                [
                                    { 
                                        text: `EMISSOR: ${req.user.nome}`,
                                        fontSize: 9,
                                        bold: true
                                    }
                                ],
                            ],
                        }
                    },
                    // Segunda Table - Cabeçalho Conteúdo
                    {
                        layout: {
                            fillColor: (rowIndex, node, columnIndex) => (rowIndex === 0) ? '#c2dec2' : null
                        },
                        table: {
                            widths: [80, 35, 50, '*', 65, '*'],
                            body: [
                                cabecalho
                            ]
                        }
                    },
                    //Terceira Table - Corpo Conteúdo
                    {
                        table: {
                            widths: [80, 35, 50, '*', 65, '*'],
                            fontSize: 9,
                            body: listaRelatorio,
                        }
                    },
                    //Quarta Table - Rodapé conteúto Total.
                    {
                        table: {
                            widths: ["95%","5%"],
                            heights: [10],
                            body: [
                                [
                                    {
                                        text: 'Total de produtos solicitados:',
                                        //      Left    , Top  , rigth, bottom
                                        border:[true, false, false, true],
                                        alignment: 'right',
                                        fontSize: 12,
                                        bold: true
                                    },
                                    {
                                        text: qntItens,
                                        //      Left    , Top  , rigth, bottom
                                        border:[false, false, true, true],
                                        fontSize: 12,
                                        bold: true
                                    }
                                ],
                            ],
                        }
                    },
                ],
                defaultStyle: {
                    font: 'Times'
                }
            }

            const printer = new PdfPrinter(fonts)
            const nomeArquivo = `pdf/relatorio-${trocarOrdemData(req.query.dataInicial.split(' ')[0])}-a-${trocarOrdemData(req.query.dataFinal.split(' ')[0])}.pdf`
            let pdfDoc = printer.createPdfKitDocument(docDefinition)
            if(!fs.existsSync('pdf/')){
                fs.mkdirSync('pdf/')
            }
            const file = fs.createWriteStream(nomeArquivo)
            pdfDoc.pipe(file)
            pdfDoc.end()
            file.on('finish', () => {
                file.close()
                res.download(nomeArquivo, (err) => {
                    if(!err){
                        fs.unlink(nomeArquivo, (err) => {
                            if(err){
                                req.flash("error_msg", `erro a deletar arquivo`)
                            }
                        })
                    }
                })
            })
        }

        //Calculando Paginação
        const paginas = paginacao('/admin/relatorio', pagina, limite, totalItens)
        res.render('admin/relatorio/index', {solicitacao, paginas})

    }catch(error){
        req.flash("error_msg", "Houve um erro ao tentar carregar os dados.")
        res.redirect("/")
    }
})

module.exports = router