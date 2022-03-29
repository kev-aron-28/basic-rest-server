const { Socket } = require("socket.io");
const { checkJWT } = require("../helpers/generateJWT");
const { ChatMessages } = require("../models");
const chatMessage = new ChatMessages();


const socketController = async ( socket = new Socket(), io) => { 
    const user = await checkJWT(socket.handshake.headers['x-token'])
    if(!user) {
        return socket.disconnect();
    }
    
    chatMessage.connectUser(user);
    io.emit('usuarios-activos', chatMessage.usersArr);
    socket.emit('recibir-mensajes', chatMessage.last10 );

    socket.join(user.id);

    socket.on('disconnect', () => {
        chatMessage.disconnectUser(user.id);
        io.emit('usuarios-activos', chatMessage.usersArr);
    })

    socket.on('enviar-mensaje',({ message, uid }) => {

        if(uid){
            socket.to(uid).emit('mensaje-privado', {
                from: user.name,
                message
            })
        } else {
            chatMessage.sendMessage(user.id, user.name, message);
            socket.emit('recibir-mensajes', chatMessage.last10 );
        }

    })
}

module.exports = {
    socketController
}