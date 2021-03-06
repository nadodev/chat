import mongoose, {Document, Schema, SchemaTypeOptions} from "mongoose";

type Message = Document & {
  to:String;
  text : String;
  created_at: Date;
  room_id: String
}

const MessageSchema = new Schema({
  to:  {
    type: Schema.Types.ObjectId,
    ref: "Users"
  },
  text: String,
  created_at: {
    type: Date,
    default:Date.now()
  },
  roomId: {
    type: String,
    ref: "ChatRoom"
  },
});


const Message = mongoose.model<Message>('Messages', MessageSchema);
export {Message}