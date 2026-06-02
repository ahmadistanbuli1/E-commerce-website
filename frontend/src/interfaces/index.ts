export interface ILoginInput {
  type: string;
  placeholder: string;
  name: "email" | "password";
}

export interface IRegisterInput {
  type: string;
  placeholder: string;
  name: "firstName" | "lastName" | "email" | "password";
}
