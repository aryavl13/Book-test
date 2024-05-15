"use client"
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/router";
import { FiLock, FiMail } from "react-icons/fi";
import Link from "next/link";
import { ToastContainer } from "react-toastify";
import InputArea from "@/components/form/InputArea";
import useLoginSubmit from "@/hooks/useLoginSubmit";
import Image from "next/image";

interface LoginFormData {
  registerEmail: string;
  password: string;
}

const Login = () => {
  const { handleSubmit, submitHandler, register, errors, loading } =
    useLoginSubmit();
  const [showResetPassword, setShowResetPassword] = useState<boolean>(false);

  const renderErrors = (errorObject: any) => {
    return Object.values(errorObject).map((error: any, index: number) => (
      <div key={index}>{error.message}</div>
    ));
  };

  return (
    <>
      <ToastContainer />
      <div className="flex flex-col justify-center items-center w-full py-10">
        <div className="border p-5 w-6/12">
          <div className="text-center mb-6">
            <h2 className="text-3xl font-bold font-serif">Login</h2>
            <p className="text-sm md:text-base text-gray-500 mt-2 mb-8 sm:mb-10">
              Login with your email and password
            </p>
          </div>
          <form
            onSubmit={handleSubmit(submitHandler)}
            className="flex flex-col justify-center"
          >
            <div className="grid grid-cols-1 gap-5">
              <div className="form-group">
                <InputArea
                  register={register}
                  label="Email"
                  name="registerEmail"
                  type="email"
                  placeholder="Email"
                  Icon={FiMail}
                />
                {errors.registerEmail && renderErrors(errors.registerEmail)}
              </div>
              <div className="form-group">
                <InputArea
                  register={register}
                  label="Password"
                  name="password"
                  type="password"
                  placeholder="Password"
                  Icon={FiLock}
                />
                {errors.password && renderErrors(errors.password)}
              </div>

              <div className="flex items-center justify-between">
                <div className="flex ms-auto">
                  <button
                    type="button"
                    onClick={() => setShowResetPassword(true)}
                    className="text-end text-sm text-heading ps-3 underline hover:no-underline focus:outline-none"
                  >
                    Forgot password?
                  </button>
                </div>
              </div>
              {loading ? (
                <button
                  disabled={loading}
                  type="submit"
                  className="md:text-sm leading-5 inline-flex items-center cursor-pointer transition ease-in-out duration-300 font-medium text-center justify-center border-0 border-transparent rounded-md placeholder-white focus-visible:outline-none focus:outline-none bg-emerald-500 text-white px-5 md:px-6 lg:px-8 py-2 md:py-3 lg:py-3 hover:text-white hover:bg-emerald-600 h-12 mt-1 text-sm lg:text-sm w-full sm:w-auto"
                >
                  <Image
                    src="/loader/spinner.gif"
                    alt="Loading"
                    width={20}
                    height={10}
                  />
                  <span className="font-serif ml-2 font-light">Processing</span>
                </button>
              ) : (
                <button
                  disabled={loading}
                  type="submit"
                  className="w-full text-center py-3 rounded bg-emerald-500 text-white hover:bg-emerald-600 transition-all focus:outline-none my-1"
                >
                  Login
                </button>
              )}
              <div className="text-gray-500 mt-2.5 text-center">
                <p className="text-sm">
                  Not have a account ?
                  <Link
                    href="/register"
                    className="text-gray-800 hover:text-emerald-500 font-bold mx-2"
                  >
                    Register
                  </Link>
                </p>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default Login;
