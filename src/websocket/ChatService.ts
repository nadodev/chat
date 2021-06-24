import { container } from "tsyringe";
import {io} from "../http";
import { CreateChatRomService } from "../services/CreateChatRomService";
import { CreateMessageService } from "../services/CreateMessageService";
import { CreateUserService } from "../services/CreateUserService";
import { GetAllUserServices } from "../services/GetAllUserServices";
import { GetChatRoomByUsersService } from "../services/GetChatRoomByUsersService";
import { GetMessagesByChatRoomService } from "../services/GetMessagesByChatRoomService";
import { GetUserBySocketIdService } from "../services/GetUserBySocketIdService";

io.on("connect", socket =>{
  socket.on("start", async data =>{
      const {email, avatar, name} = data;
      const createUserService = container.resolve(CreateUserService)
  

     const user = await createUserService.execute({
        email, avatar, name, socket_id: socket.id,
      });
  
      socket.broadcast.emit("new_users", user);

  });
  socket.on("get_users", async (callback) => {
    const getAllUsersService = container.resolve(GetAllUserServices);
    const users = await getAllUsersService.execute();

    callback(users);
  })
  socket.on("start_chat", async(data, callback) => {
      const createChatRoomService = container.resolve(CreateChatRomService);
      const getChatRoomByUsersService = container.resolve(GetChatRoomByUsersService)
      const getUserBySocketIdService = container.resolve(
        GetUserBySocketIdService
        );

        const getMessagesByChatRoomService = container.resolve(GetMessagesByChatRoomService);
        const userLogged = await getUserBySocketIdService.execute(socket.id);

        let room = await getChatRoomByUsersService.execute([
          data.idUser, 
          userLogged._id,
         ]);

         if(!room){
          room = await createChatRoomService.execute([
            data.idUser, 
            userLogged._id
           ]);
         }
         socket.join(room.idChatRoom);

         //buscar messsagem
         const messages = await getMessagesByChatRoomService.execute(room.idChatRoom)
       callback({room, messages});
  });

  socket.on("message", async data => {
    const getUserBySocketIdService = container.resolve(GetUserBySocketIdService);
    const createMessageService = container.resolve(CreateMessageService)
    const user = await getUserBySocketIdService.execute(socket.id)
    const message = await createMessageService.execute({
      to: user._id,
      text: data.message,
      roomId: data.idChatRoom,
    });
    io.to(data.idChatRoom).emit("message",{
      message,
      user,
    });
  });
});