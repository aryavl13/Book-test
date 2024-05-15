import requests from "./httpServices";

interface LoginBody {
  email: string;
  password: string;
}

interface RegisterBody {
  firstname: string;
  lastname: string;
  email: string;
  password: string;
  confirmedPassword: string;
}

const AuthServices = {
  userLogin: async (body: LoginBody) => {
    console.log("hello");
    return requests.post("/auth/login", body);
  },
  userRegister: async (body: RegisterBody) => {
    return requests.post("/auth/register", body);
  },
};

export default AuthServices;
