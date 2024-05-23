//Express
import express from 'express'
//Mongo
import mongoose from 'mongoose'
//Dotenv
import dotenv from 'dotenv'
//Rutas
import productRouter from "./routes/products.router.js"
import cartRouter from './routes/carts.router.js'
//Handlebars
import __dirname from './utils.js'
import handlebars from 'express-handlebars'
//Socket
import { Server } from 'socket.io'

const app = express()
const PORT = 8080
dotenv.config()
const httpServer = app.listen(PORT, () => console.log(`Server is running on port ${PORT}`))

const socketServer = new Server(httpServer)
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Configurar Handlebars con opciones para permitir el acceso a propiedades del prototipo
const hbs = handlebars.create({
    extname: '.handlebars',
    defaultLayout: 'main',
    layoutsDir: __dirname + '/views/layouts',
    runtimeOptions: {
        allowProtoPropertiesByDefault: true,
        allowProtoMethodsByDefault: true
    }
})

app.engine('handlebars', hbs.engine)
app.set('views', __dirname + '/views')
app.set('view engine', 'handlebars')

app.use(express.static(__dirname + '/public'))
app.use('/api/products', productRouter)
app.use('/api/carts', cartRouter)

mongoose.connect('mongodb+srv://primeraEntrega:132132132@zettacluster.hoh8p1r.mongodb.net/EcommerceSE?retryWrites=true&w=majority&appName=ZettaCluster', {})
    .then(() => { console.log("Conectado a la base de datos") })
    .catch(error => console.error("Error en la conexión", error))

socketServer.on('connection', socket => {
    console.log("Nuevo cliente conectado, id: ", socket.id)
    socket.on('disconnect', () => {
        console.log('Un cliente se ha desconectado')
    })
})

export function getIO() {
    return socketServer
}
