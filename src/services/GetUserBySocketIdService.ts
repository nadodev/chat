import { injectable } from "tsyringe";
import { User } from "../Schemas/User";

@injectable()
class GetUserBySocketIdService{
  async execute(socket_id: string){
    const user = await User.findOne({
      socket_id,
    })
    return user;
  }
}
export {GetUserBySocketIdService}