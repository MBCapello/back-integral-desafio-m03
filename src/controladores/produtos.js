const conexao = require('../conexao');

const cadastrarProdutos = async (req, res) => {
    const {nome, quantidade, categoria, preco, descricao, imagem} = req.body;
    const {id} = req.usuario;
    
    if (!nome) {
         return res.status(400).json('O campo nome é obrigatório.')
     }
     if (!quantidade) {
        return res.status(400).json('O campo quantidade é obrigatório.')
    }
    if (!preco) {
        return res.status(400).json('O campo preco é obrigatório.')
    }
    if (!descricao) {
        return res.status(400).json('O campo descricao é obrigatório.')
    }
    

    try {
        const {rowCount} = await conexao.query('insert into produtos (nome, usuario_id, quantidade, categoria, preco, descricao, imagem) values ($1, $2, $3, $4, $5, $6, $7)',[nome, id, quantidade, categoria, preco, descricao, imagem]);

        if (rowCount === 0) {
            return res.status(400).json('Não foi possível cadastrar o produto')
        }

        return res.status(201).send();

    } catch (error) {
        return res.status(error.message);
    }

};

const listarProdutos = async (req, res) => {
    const {id} = req.usuario;
    const {categoria} = req.query;

    if(!categoria) {

        try {
            const {rows,rowCount} = await conexao.query('select * from produtos where usuario_id = $1',[id])
            if (rowCount === 0) {
                return res.status(404).json(rows)
            }
            return res.status(200).json(rows)
        } catch (error) {
            return res.status(error.message)
        }
    }

    try {
        const {rows,rowCount} = await conexao.query('select * from produtos where usuario_id = $1 and categoria = $2',[id,categoria])
        if (rowCount === 0) {
            return res.status(404).json(`Não existem produtos com a categoria ${categoria}`)
        }
        return res.status(200).json(rows)
    } catch (error) {
        return res.status(error.message)
    }
};

const listarProdutosPorId = async (req, res)=> {
    const {id: produtoId} = req.params;
    const {id} = req.usuario;
    try {
        const {rows,rowCount} = await conexao.query('select * from produtos where id = $1 and usuario_id = $2' ,[produtoId, id])
        if (rowCount === 0) {
            return res.status(404).json(`Não existe produto cadastrado com ID ${produtoId}.`)
        }
        return res.status(200).json(rows[0])
    } catch (error) {
        return res.status(error.message)
    }
};

const atualizarProdutos = async (req, res) => {
    const {id} = req.usuario;
    const {id:produtoId} = req.params;
    const {nome, quantidade, categoria, preco, descricao, imagem} = req.body;

    if (!nome) {
        return res.status(400).json('O campo nome é obrigatório.')
    }
    if (!quantidade) {
        return res.status(400).json('O campo quantidade é obrigatório.')
    }
    if (!preco) {
        return res.status(400).json('O campo preco é obrigatório.')
    }
    if (!descricao) {
        return res.status(400).json('O campo nome_loja é obrigatório.')
    }

    try {

        const {rowCount} = await conexao.query('update produtos set nome = $1, quantidade = $2, categoria = $3, preco = $4, descricao = $5, imagem = $6 where id = $7 and usuario_id = $8' ,[nome, quantidade, categoria, preco, descricao, imagem, produtoId, id]);

        if (rowCount === 0) {
            return res.status(400).json('Não existem produtos com o id informado')
        }
        return res.status(201).send()

    } catch (error) {
        return res.status(error.message)
    }
};

const deletarProdutos = async (req, res) => {
    const {id} = req.usuario;
    const {id:produtosId} = req.params;

    try {
        const {rowCount} = await conexao.query('delete from produtos where id = $1 and usuario_id = $2',[produtosId, id]);

        if (rowCount === 0) {
            return res.status(401).json(`Não existem produtos com o id ${produtosId}`);
        }

        return res.status(200).send();
    } catch (error) {
        
    }
};

module.exports = {
    cadastrarProdutos,
    listarProdutos,
    listarProdutosPorId,
    atualizarProdutos,
    deletarProdutos
}