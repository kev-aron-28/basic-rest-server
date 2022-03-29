let user = null;
let socket = null;

const txtUid = document.querySelector("#txtUid")
const txtMessage = document.querySelector("#txtMessage")
const ulUsers = document.querySelector("#ulUsers")
const ulMessages = document.querySelector("#ulMessages")
const btnLogout = document.querySelector("#btnLogout")

const url = (window.location.hostname.includes('localhost')) ? 'http://localhost:3000/api/auth/' : 'https://restserver-basic-node-2.herokuapp.com/api/auth/';

const validateJWT = async () => {
    const token = localStorage.getItem('token') || '';
    if(token.length <= 10) {
        window.location = 'index.html';
        throw new Error('No hay token en el servidor');
    }

    const resp = await fetch( url, {
        headers: {
            'x-token': token
        }
    });

    const { user: userDB, token: tokenDB } = await resp.json()
    localStorage.setItem('token', tokenDB);
    document.title = userDB.name;

    await connectToken();
}

const connectToken = async () => {
    socket = io({
        'extraHeaders': {
            'x-token': localStorage.getItem('token')
        }
    });

    socket.on('connect', () => {
        console.log('Socket online');
        
    })
    socket.on('disconnect', () => {
        console.log('Socket offline');
        
    })
    socket.on('recibir-mensajes', drawMessages);

    socket.on('usuarios-activos', drawUsers);

    socket.on('mensaje-privado', (payload) => {
        console.log('Privado', payload);
    })
}

txtMessage.addEventListener('keyup', ({ keyCode }) => {
    const message = txtMessage.value;
    const uid = txtUid.value;
    if(keyCode !== 13) { return };
    if(message.length <= 0) { return; }

    socket.emit('enviar-mensaje', { message, uid });

})

const main = async () => {
    await validateJWT();
}

const drawUsers = (users = []) => {
    let usersHTML = '';
    users.forEach(({ name, uid }) => {
        usersHTML += `
            <li>
                <p>
                    <h5 class="text-success">${name}</h5>
                    <span class="fs-6 text-muted">${uid}</span>
                </p>
            </li>
        `
    })

    ulUsers.innerHTML = usersHTML;
}


const drawMessages = (messages = []) => {
    let messagesHTML = '';
    messages.forEach(({message, name}) => {
        messagesHTML += `
            <li class="row">
                <p>
                    <span class="text-primary">${name}:</span>
                    <span>${message}</span>
                </p>
            </li>
        `
    })

    ulMessages.innerHTML = messagesHTML;
}


main();