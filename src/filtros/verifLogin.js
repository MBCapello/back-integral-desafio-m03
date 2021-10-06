const jwt = require('jsonwebtoken');
const conexao = require('../conexao');
const {authToken} = require('../jwt')

const verifLogin = async (req, res, next) => {
    const {authorization} = req.headers;
    
    if(!authorization) {
        return res.status(404).json('Token não informado.')
    }

    try {
        const token = authorization.replace("Bearer", "").trim();

        const {id} = jwt.verify(token, authToken);

        const {rows, rowCount} = await conexao.query('select * from usuarios where id = $1',[id]);

        if(rowCount === 0) {
            return res.status(400).json('Usuário não encontrado');
        }

        const {senha, ...usuario} = rows[0];

        req.usuario= usuario;

        next();
        
    } catch (error) {
        return res.status(404).json(error.message);
    }
};

module.exports = {
    verifLogin
}