const express = require('express');
const { login } = require('./controladores/login');
const { cadastrarProdutos, listarProdutos, listarProdutosPorId, atualizarProdutos, deletarProdutos } = require('./controladores/produtos');
const { cadastrarUsuario, detalharUsuario, atualizarUsuario } = require('./controladores/usuarios');
const { verifLogin } = require('./filtros/verifLogin');

const rotas = express();


rotas.post('/usuario', cadastrarUsuario);
rotas.post('/login', login)
rotas.use(verifLogin);
rotas.get('/usuario', detalharUsuario);
rotas.put('/usuario', atualizarUsuario);
rotas.put('/produtos', cadastrarProdutos);
rotas.get('/produtos', listarProdutos)
rotas.get('/produtos/:id', listarProdutosPorId);
rotas.put('/produtos/:id', atualizarProdutos);
rotas.delete('/produtos', deletarProdutos);

module.exports = rotas;