import { injectable } from "tsyringe";
import { User } from "../Schemas/User"

interface CreateUserDTO{
  email: string;
  socket_id: string;
  avatar: string;
  name: string;
}


@injectable()
class CreateUserService{

  async execute({email, socket_id, avatar, name}: CreateUserDTO){
    const userAlreadExists = await User.findOne({
      email,
    }).exec();

    if(userAlreadExists){
      const user = await User.findOneAndUpdate({
        _id: userAlreadExists._id
      },
      {
        $set: {socket_id, avatar, name},
      },
      {
        new: true,
      }
      )
      return user;
    }else{
      const user = await User.create({
        email,
        socket_id, 
        avatar, 
        name
      })
      return user;
    }
  }

}
export { CreateUserService}