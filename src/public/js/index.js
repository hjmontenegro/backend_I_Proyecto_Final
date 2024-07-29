/* io hace referencia a socket.io */
const socket = io()

socket.emit('message', 'Soy un mensaje enviado')

