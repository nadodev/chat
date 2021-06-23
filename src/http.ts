import "reflect-metadata"
import express from 'express';
import {createServer} from 'http';
import { Server } from 'socket.io'
import path from 'path';
import mongoose  from 'mongoose';

const app = express();
const server = createServer(app);

//banco de dados mongodb
mongoose.connect("mongodb://localhost:27017/agenciaChat",{
  useNewUrlParser: true,
  useUnifiedTopology: true
})

//middlwares
app.use(express.json());
app.use(express.static(path.join(__dirname, '..', 'public')));

//websocket io
const io = new Server(server);
io.on("connection",  (socket) =>{
  console.log("Socket", socket.id);
})

//servidor node
app.get('/', (req, res) => {
  res.json({
    message: 'True'
  })
})

export { server , io}