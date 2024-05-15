import { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import Cookies from "js-cookie";
// import AuthServices from "@/service/AuthServices";
// import { useAppDispatch } from "@/redux/hooks";
// import { loggedInUser } from "@/redux/features/auth";
import { notifyError, notifySuccess } from "@/utils/toast";
import { useRouter } from "next/navigation";
import AuthServices from "@/services/AuthServices";
import { AppDispatch } from "@/redux/store";
import { useAppDispatch } from "@/redux/hooks";
import { loggedInUser } from "@/redux/features/auth";

interface LoginFormValues {
  name?: string;
  email?: string;
  registerEmail?: string;
  password?: string;
  fname?: string;
  lname?: string;
  confirmedPassword?: string;
}

const useLoginSubmit = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const dispatch = useAppDispatch<AppDispatch>();
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<LoginFormValues>();

  const submitHandler: SubmitHandler<LoginFormValues> = async (data) => {
    setLoading(true);
    const cookieTimeOut = 0.5;

    try {
      if (data.registerEmail && data.password) {
        const res = await AuthServices.userLogin({
          email: data.registerEmail,
          password: data.password,
        });
        setLoading(false);
        console.log(res);
        
        if (res.error) {
          notifyError(res.error);
        } else {
          notifySuccess("Login Success!");
          dispatch(loggedInUser(res));
          Cookies.set("userInfo", JSON.stringify(res), {
            expires: cookieTimeOut,
          });
          router.push("/");
        }
      }
      if (data.fname && data.lname && data.email && data.password) {
        if (data.password !== data.confirmedPassword) {
          notifyError("Password do not match");
        } else {
          const res = await AuthServices.userRegister({
            firstname: data.fname,
            lastname: data.lname,
            email: data.email,
            password: data.password,
            confirmedPassword: data.confirmedPassword,
          });
          if (res.error) {
            notifyError(res.error);
          } else {
            setLoading(false);
            notifySuccess("Successfully registered");
            router.push("/login");
          }
        }
      }
    } catch (err:any) {
      notifyError(err ? err?.response?.data?.message : err?.message);
      setLoading(false);
    }
  };

  return {
    handleSubmit,
    submitHandler,
    register,
    errors,
    loading,
  };
};

export default useLoginSubmit;
