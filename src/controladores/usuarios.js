const conexao = require('../conexao');
const bcrypt = require('bcrypt');

const cadastrarUsuario = async (req, res) => {
    const {nome, email, senha, nome_loja} = req.body;

    if (!nome) {
        return res.status(400).json('O campo nome deve ser preenchido.')
    }
    if (!email) {
        return res.status(400).json('O campo email deve ser preenchido.')
    }
    if (!senha) {
        return res.status(400).json('O campo senha deve ser preenchido.')
    }
    if (!nome_loja) {
        return res.status(400).json('O campo nome_loja deve ser preenchido.')
    }

    try {
        const {rowCount} = await conexao.query('select * from usuarios where email = $1',[email])
        
        if (rowCount > 0) {
            return res.status(403).json('O email já está cadastrado')
        }

        const senhaCrypt = await bcrypt.hash(senha, 10);

        const user = await conexao.query('insert into usuarios (nome, email, senha, nome_loja) values ($1, $2, $3, $4)', [nome, email, senhaCrypt, nome_loja]);

        if (user.rowCount === 0) {
            return res.status(400).json('Não foi possível cadastrar o usuário');
        }

        res.status(201).send();

    } catch (error) {
        return res.status(error.message)
    }
};

const detalharUsuario = async (req, res) => {
        const {id} = req.usuario;
    try {

        const {rows, rowCount} = await conexao.query('select * from usuarios where id = $1',[id]);

        if(rowCount === 0) {
            return res.status(400).json('Usuário não encontrado');
        }

        const {senha, ...usuario} = rows[0];

        return res.status(200).json(usuario)
        
    } catch (error) {
        return res.status(404).json(error.message);
    }

};

const atualizarUsuario = async (req, res) => {
    const {id} = req.usuario;
    const {nome, email, senha, nome_loja} = req.body;

    if (!nome) {
        return res.status(400).json('O campo nome é obrigatório.')
    }
    if (!email) {
        return res.status(400).json('O campo email é obrigatório.')
    }
    if (!senha) {
        return res.status(400).json('O campo senha é obrigatório.')
    }
    if (!nome_loja) {
        return res.status(400).json('O campo nome_loja é obrigatório.')
    }

    try {
        const senhaCrypt = await bcrypt.hash(senha, 10);

        const {rowCount} = await conexao.query('update usuarios set nome = $1, email = $2, senha = $3, nome_loja = $4 where id = $5',[nome, email, senhaCrypt, nome_loja, id]);

        if (rowCount === 0) {
            return res.status(400).json('Não houve mudanças no usuário')
        }
        return res.status(201).send()

    } catch (error) {
        return res.status(400).json('O endereço de email informado já possui cadastro')
    }

};

module.exports = {
    cadastrarUsuario,
    detalharUsuario,
    atualizarUsuario
}

