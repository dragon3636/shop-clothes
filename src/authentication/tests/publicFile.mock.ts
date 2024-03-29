import PublicFile from "src/files/entities/publicFile.entity";
import PrivateFile from "src/private-file/privateFile.entity";
import { mockedUser } from "./user.mock";

export const mockedFile: PublicFile = {
  id: 1,
  url: "/avatar/c8c1697b-8d83-4d0b-83d5-9cdcb81355a9-15dc8802cb80e1881950801e265166d2.jpg",
  key: "c8c1697b-8d83-4d0b-83d5-9cdcb81355a9-15dc8802cb80e1881950801e265166d2.jpg",
}
export const mockedPrivateFile: PrivateFile = {
  id: 2,
  key: 'a57163d8-2d86-431d-ac58-520b2b016f50-shortpants_01.jpg',
  owner: mockedUser
}