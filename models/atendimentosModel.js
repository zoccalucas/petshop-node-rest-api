const moment = require('moment')
const { query } = require('../infraestrutura/conexao')
const conexao = require('../infraestrutura/conexao')

class Atendimento {
    adiciona(atendimento, res) {
        const dataCriacao = moment().format('YYYY-MM-DD HH:mm:ss')
        const data = moment(atendimento.data, 'DD/MM/YYYY').format('YYYY-MM-DD HH:mm:ss')

        const dataValida = moment(data).isSameOrAfter(dataCriacao)
        const clienteValido = atendimento.cliente.length >= 5

        const validacoes = [
            {
                nome: 'data',
                valido: dataValida,
                mensagem: 'Data deve ser maior ou igual a data atual'
            },
            {
                nome: 'cliente',
                valido: clienteValido,
                mensagem: 'Cliente deve ter pelo menos cinco caracteres'
            }
        ]

        //retorna caso o campo seja inválido (false)
        const erros = validacoes.filter(campo => !campo.valido)
        const existemErros = erros.length

        if(existemErros){
            res.status(400).json(erros)
        } else{
            const atendimentoDatado = {...atendimento, dataCriacao, data}
            const sql = 'INSERT INTO Atendimentos SET ?'
            conexao.query(sql, atendimentoDatado, (erro, resultados) => {
                if(erro) {
                    res.status(400).json(erro)
                } else {
                    res.status(200).json(atendimento)
                }
            })
        }
    }

    lista(res) {
        const sql = 'SELECT * FROM Atendimentos'

        conexao.query(sql, (erro, resultados) => { 
            if(erro) {
                res.status(400).json(erro)
            } else { 
                res.status(200).json(resultados)
            }
        })
    }

    buscaPorId(id, res){
        const sql = `SELECT * FROM Atendimentos WHERE id = ${id}`

        conexao.query(sql, (erro, resultados) => {
            const atendimento = resultados[0]
            if(erro) {
                res.status(400).json(erro)
            } else { 
                res.status(200).json(atendimento)
            }            
        })
    }

    altera(id, valores, res) {
        const sql = `UPDATE Atendimentos SET ? WHERE id = ${id}`
        
        if(valores.data){
            valores.data = moment(valores.data, 'DD/MM/YYYY').format('YYYY-MM-DD HH:mm:ss')
        }

        conexao.query(sql, [valores, id], (erro, resultados) => { 
            if(erro) {
                res.status(400).json(erro)
            } else {
                res.status(200).json({...valores, id})
            }
        })
    } 

    deleta(id, res){
        const sql = `DELETE FROM Atendimentos WHERE id = ${id}`

        conexao.query(sql, id, (erro, resultados) => {
            if(erro) {
                res.status(400).json(erro)
            } else {
                res.status(200).json({id})
            }
        })
    }
}

module.exports = new Atendimento