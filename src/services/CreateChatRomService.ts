import { injectable } from "tsyringe";
import { ChatRoom } from "../Schemas/ChatRoom";

@injectable()
class CreateChatRomService{
  async execute(idUsers : String[]){
    const room = await ChatRoom.create({
      idUsers,
    })
    return room;
  }
}
export {CreateChatRomService}