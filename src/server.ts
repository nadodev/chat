
import {server} from './http';
import "./websocket/ChatService"
server.listen(3000, () =>  console.log('app running in port 3000'));