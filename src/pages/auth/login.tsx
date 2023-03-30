import { useRouter } from "next/router";
import React, { useRef } from "react";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import axios, { AxiosError } from "axios";
import cookies from "js-cookie";
import { ServerMessage } from "../../utils/interfaces/response-message";
import { regEmail } from "@/utils/interfaces/regex";
import AuthLayout from "@/components/layouts/auth";
import Alert from "@/components/tools/alerts/alert";
import { baseUrl } from "@/utils/interfaces/constants";
import { JWTServer } from "@/utils/interfaces/server-props";
import jwt_decode from "jwt-decode";
import { NextResponse } from "next/server";
interface FormState {
  email: string;
  password: string;
  isKeepSignedIn: boolean;
}

export default function Login() {
  const [isSuccess, SetIsSuccess] = useState(false);
  const [isServerError, SetIsServerError] = useState(false);
  const [errMessage, SetErrMessage] = useState("");
  const [values, setValues] = React.useState<FormState>({
    email: "",
    password: "",
    isKeepSignedIn: false,
  });

  const ref = useRef<any>();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<FormState>();

  const handleChange = (prop: keyof FormState) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setValues({ ...values, [prop]: event.target.value });
  };

  const onSubmit: SubmitHandler<FormState> = async (data: FormState) => {
    SetErrMessage("");
    await axios(`${baseUrl}/auth/login`, {
      method: "POST",
      data: {
        email: data.email,
        password: data.password,
        isKeepSignedIn: data.isKeepSignedIn,
      },
    })
      .then((res) => {
        SetIsSuccess(res.data.message);
        const token: string = res.data.accessToken;
        const decoded: JWTServer = jwt_decode(token);

        cookies.set("accessToken", res.data.accessToken, {
          expires: new Date(decoded.exp * 1000),
          path: "/",
          secure: true,
        });

        res.data.role === "admin" ? router.push("/admin") : router.push("/me");
        // return NextResponse.next();
      })
      .catch((error) => {
        SetIsServerError(true);
        console.log(error);

        error.response?.data?.message
          ? SetErrMessage(error.response.data.message)
          : SetErrMessage(ServerMessage.RequestError);
      });
  };

  return (
    <AuthLayout headerText="Masuk">
      <form className="space-y-6" onSubmit={handleSubmit(onSubmit)} ref={ref}>
        <div id="login-form" className="space-y-4">
          <div>
            <label htmlFor="email" className="block mb-2 text-md font-medium text-gray-900">
              Alamat email
            </label>
            <input
              type="email"
              id="email"
              className={`bg-gray-50 border border-gray-300 text-gray-900 text-md rounded-md block w-full p-2.5 hover:border-blue
                ${errors.email ? "focus:outline-errorRed" : "focus:outline-blue"}`}
              placeholder="Masukkan alamat email yang terdaftar"
              required
              {...register("email", {
                required: {
                  value: true,
                  message: "Masukkan alamat email",
                },
                pattern: {
                  value: regEmail,
                  message: "Harap masukkan alamat email yang sesuai",
                },
              })}
            />
            {errors.email && (
              <span className="font-medium t-2 text-xs text-red-600">{errors.email?.message}</span>
            )}
          </div>
          <div>
            <label htmlFor="password" className="block mb-2 text-md font-medium text-gray-900">
              Kata sandi
            </label>
            <input
              type="password"
              id="password"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-md rounded-md block w-full p-2.5 hover:border-blue focus:border-blue focus:outline-blue"
              placeholder="Kata sandi"
              required
              {...register("password", {
                required: {
                  value: true,
                  message: "Masukkan kata sandi anda",
                },
              })}
            />
          </div>
          <div>
            <div className="flex items-center">
              <input
                id="keepSigned"
                type="checkbox"
                {...register("isKeepSignedIn")}
                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 cursor-pointer"
              />
              <label htmlFor="keepSigned" className="ml-2 text-sm font-medium text-gray-900">
                Biarkan saya tetap masuk
              </label>
            </div>
          </div>
        </div>
        <div id="login-button" className="md:w-1/2 flex flex-col md:mx-auto space-y-2">
          <div id="auth-message">{errMessage && <Alert text={errMessage} type="danger" />}</div>
          <button
            type="submit"
            ref={ref}
            className="text-white text-center font-semibold bg-palepurple hover:bg-hovpalepurple focus:ring-1 focus:outline-none focus:ring-hovpalepurple rounded-md text-md px-4 py-3 w-full">
            Masuk
          </button>
        </div>
        <div className="grid grid-cols-1 text-center text-md space-y-2">
          <a
            className="text-blue hover:text-hovblue font-bold w-fit m-auto"
            href="/auth/forgot-password">
            Lupa kata sandi
          </a>
          <p>
            Belum punya akun?{" "}
            <a className="text-blue hover:text-hovblue font-bold" href="/auth/register">
              Daftar
            </a>
          </p>
        </div>
      </form>
    </AuthLayout>
  );
}
