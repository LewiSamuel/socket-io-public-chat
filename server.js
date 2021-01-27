const express = require('express');
const path = require('path');

const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
// EVENTOS DO SOCKET-IO
// - - emit = envia uma mensagem para o socket ( conexao/ usuario ) especifico
// - - on   = ouvir uma mensagem de um evento
// - - broadcast.emit = envia um evento para todos coneectados

// diretorio com arquivos estaticos ( front - end )
app.use(express.static(path.join(__dirname, 'public')));
// congigura onde estão as views 
app.set('views', path.join(__dirname, 'public'));
// engine HTML / ejs
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');


// rota padrao
app.use('/', (req, res) => {
    res.render('index.html');
});

// array que armazena todas as mensagens
let messages = [];

// pegar cada conexao de um novo client
io.on('connection', socket => {
    
    // id de quem conectou
    console.log('socket conectado: ' + socket.id)

    // envia o array completo de mensagens ao evento previousMessage
    socket.emit('previousMessage', messages);

    // escuta o evento sendMessage ( recebe os dados )
    socket.on('sendMessage', data => {
        console.log(data);
        messages.push(data);
        // envia o evento receivedMEssage para todos os sockets
        socket.broadcast.emit('receivedMessage', data);
    })
})

server.listen(process.env.PORT || 3000);