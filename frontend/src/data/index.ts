import { ILoginInput, IRegisterInput } from "../interfaces";

export const LOGIN_DATA: ILoginInput[] = [
  {
    name: "email",
    placeholder: "Enter Your Email Here",
    type: "email",
  },
  {
    name: "password",
    placeholder: "Enter Your Password Here",
    type: "password",
  },
];

export const REGISTER_DATA : IRegisterInput[] = [
  {
    name: "firstName",
    placeholder: "Enter Your First Name Here",
    type: "text",
  },
  {
    name: "lastName",
    placeholder: "Enter Your Last Name Here",
    type: "text",
  },
  {
    name: "email",
    placeholder: "Enter Your Email Here",
    type: "email",
  },
  {
    name: "password",
    placeholder: "Enter Your Password Here",
    type: "password",
  },
];
