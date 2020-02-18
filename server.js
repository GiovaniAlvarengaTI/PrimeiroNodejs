//Criando variável que requer o Express já instalado pelo Node.js.
const express = require("express");
//Criando variável que receberá a funcionalidade Express.
const server = express();

//Habilitar 'body' do formulário.
server.use(express.urlencoded({extended:true}));

//Configurar conexão com BD
const Pool = require('pg').Pool;
const db = new Pool({
    user:'postgres',
    password:'eeu12321',
    host:'localhost',
    port:5432,
    database:'doe',
});

 

//Função 'nunjucks' instalada para permitir o uso de comandos dentro do HTML.
const nunjucks = require("nunjucks");
nunjucks.configure(/*Atalho pra raiz do projeto:*/"./",{
    express: server,
    /*Removendo o cache para evitar erros ou repetições*/
    noCache: true,
});

//Configurar o servidor para arquivos extras
server.use(express.static('public'));

//Variável 'listen' que espera receber algum valor, no caso, receberá a porta do servidor.
server.listen(3000, /*Aviso de início:*/function(){
    console.log("Servidor iniciado!");
});

server.post("/", function(req,res){
    //Puxar dados do formulário
    const name = req.body.name;
    const email = req.body.email;
    const blood = req.body.blood;

    if(name == "" || email == "" || blood == ""){
            return res.send("Todos os campos devem ser preenchidos!");
    };

    //Fazendo a query de inserção
    const query = `INSERT INTO donors ("name", "email", "blood") 
            VALUES ($1,$2,$3)`;

    const values = [name, email, blood];

    db.query(query, values, function(erro){
        //Caso erro
        if(erro){
            return res.send("Erro no banco de dados.");
        };

        //Caso sucesso
        return res.redirect("/");
    });

});

//1º "Passar o pedido" de barra para o servidor;
//2º  Pedir as requisições e respostas (req e res) do servidor;
server.get("/", function(req,res){
    
    db.query ("select * from donors;", function(erro, result){
        if (erro) return res.send("Errno no banco de dados.");
    
        const donors = result.rows;
        return res.render("index.html",/*Usando o objeto declarado:*/{donors});
    
    });

});

