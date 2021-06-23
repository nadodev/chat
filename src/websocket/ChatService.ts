import { container } from "tsyringe";
import {io} from "../http";
import { CreateChatRomService } from "../services/CreateChatRomService";
import { CreateUserService } from "../services/CreateUserService";
import { GetAllUserServices } from "../services/GetAllUserServices";
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
      const getUserBySocketIdService = container.resolve(
        GetUserBySocketIdService
        );
        const userLogged = await getUserBySocketIdService.execute(socket.id);
       const room = await createChatRoomService.execute([data.idUser, userLogged._id]);

       callback(room);
  })
});