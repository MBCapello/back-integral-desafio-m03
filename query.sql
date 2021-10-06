CREATE DATABASE market_cubos 

CREATE TABLE usuarios (
  id serial PRIMARY KEY,
  nome text not null,
  nome_loja text not null,
  email text UNIQUE not null,
  senha text not null
) 

CREATE TABLE produtos (
  id serial PRIMARY KEY,
  usuario_id int REFERENCES usuarios(id),
  nome text not null,
  quantidade int not null,
  categoria text,
  preco int not null,
  descricao text not null,
  imagem text
)	