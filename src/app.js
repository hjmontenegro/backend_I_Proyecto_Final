import express from 'express'
import mongoose from "mongoose";
import handlebars from 'express-handlebars'

import __dirname from './utils/utils.js'

import homeRouter from './routes/home.routers.js'
import productsRouter from './routes/products.routers.js'
import cartsRouter from './routes/carts.routers.js'

import { Server } from 'socket.io'
import { helpers } from "./utils/utils.js";

const app = express()
const PORT = 8080


app.use(express.json())
app.use(express.urlencoded({ extended : true }))

//Conexión a la base de datos
mongoose
  .connect(
    "mongodb+srv://hjmontenegro:gtFwcvQwwQyvxcFx@cluster0.ruii4i2.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
  )
  .then(() => {
    console.log("Conectado a la Base de Datos.");
  })
  .catch((error) =>
    console.error("Error: No se pudo conectar con la base de datos", error)
  );

  // Crear instancia de Handlebars con helpers personalizados
const hbs = handlebars.create({
  helpers: helpers,
  runtimeOptions: {
    allowProtoPropertiesByDefault: true,
  },
});

//Configurar Handlebars para leer el conrtenido de los endpoint
app.engine('handlebars', hbs.engine)
app.set('views', __dirname + '/../views') // Todo
//console.log(__dirname + '../views')
app.set('view engine', 'handlebars')

//Utilizar recursos estaticos
app.use(express.static(__dirname + '/../public'))

//Ahora toda la logica de las vistas quedan en router
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);
app.use('/', homeRouter)

/*app.listen(PORT, () => {
    console.log(`Server runing on port ${PORT}`)
})*/

const httpServer = app.listen(PORT, () => {
    console.log(`Server runing on port ${PORT}`)
})

export const socketServer = new Server(httpServer)

socketServer.on('connection', socketServer => {
    console.log(`Nuevo cliente conectado`)

    socketServer.on('producto', data => {
       
        const id = data.length > 0 ? data[data.length - 1].id + 1 : 1;
        const products = { id, ...data}

        console.log(`Dta: ${JSON.stringify(products)}`)
        //products.unshift(data);
        //fs.writeFileSync('./database/products.json',JSON.stringify(products, null, '\t'))
        socketServer.emit('productoLog', data)
    })
})

