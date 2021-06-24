import { injectable } from "tsyringe";
import { Message } from "../Schemas/Message";

@injectable()
class GetMessagesByChatRoomService{
  async execute(roomId: string){
    const messages = await Message.find({
      roomId
    }).populate("to").exec()
    return messages;
  }
}
export {GetMessagesByChatRoomService}