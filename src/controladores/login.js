const conexao = require('../conexao');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')
const {authToken} = require('../jwt')

const login = async (req, res) => {
    const {email, senha} = req.body;

    if (!email || !senha) {
        return res.status(400).json('O email e senha são obrigatórios')
    }

    try {
        const {rows, rowCount} = await conexao.query('select * from usuarios where email = $1', [email]);

        if (rowCount === 0) {
            return res.status(404).json('Usuario não encontrado')
        }

        const usuario = rows[0];
        const verifSenha = await bcrypt.compare(senha, usuario.senha);
        
        if (!verifSenha) {
            return res.status(400).json('Usuário e/ou senha inválido(s).')
        }
        
        const token = jwt.sign({id: usuario.id}, authToken,{expiresIn: '1d'});
        
        return res.status(200).json({
            token
        });

    } catch (error) {
        return res.status(error.message)
    }
}

module.exports = {
    login
}