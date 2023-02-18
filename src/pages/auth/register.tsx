import AuthLayout from "@/components/layouts/auth";
import Alert from "@/components/tools/alerts/alert";
import FormHelper from "@/components/tools/alerts/form-helper";
import { serverDevURL } from "@/utils/interfaces/constants";
import { regEmail, regPassword } from "@/utils/interfaces/regex";
import { ServerMessage } from "@/utils/interfaces/response-message";
import axios from "axios";
import { useRouter } from "next/router";
import React, { useRef, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
// import { object, string as yupString, ref as yupRef } from "yup";
// import { yupResolver } from "@hookform/resolvers/yup";

interface FormState {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export default function Register() {
  const [isSuccess, setIsSuccess] = useState(false);
  const [isServerError, setIsServerError] = useState(false);
  const [errMessage, setErrMessage] = useState("");
  const [values, setValues] = React.useState<FormState>({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const ref = useRef<any>();
  const router = useRouter();
  const swal = withReactContent(Swal);

  const {
    register,
    handleSubmit,
    control,
    watch,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm<FormState>();

  const onSubmit: SubmitHandler<FormState> = async (data: any) => {
    setErrMessage("");
    await axios(`${serverDevURL}/auth/register`, {
      method: "POST",
      data: {
        username: data.username,
        email: data.email,
        password: data.password,
        password_confirmation: data.confirmPassword,
      },
    })
      .then((res) => {
        setIsSuccess(res.data.message);
        swal
          .fire({
            title: "Yeay! kamu berhasil mendaftar",
            icon: "success",
            text: "Sekarang kamu sudah bisa menggunakan akunmu untuk masuk",
          })
          .then((res) => {
            if (res.isConfirmed) router.push("/auth/login");
          });
      })
      .catch((error) => {
        console.log(error);
        setIsServerError(true);
        error.response?.data?.message
          ? setErrMessage(error.response.data.message)
          : setErrMessage(ServerMessage.RequestError);
      });
  };

  return (
    <AuthLayout headerText={"Daftar"}>
      <form ref={ref} className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
        <div id="register-form" className="space-y-4">
          <div>
            <label htmlFor="username" className="block mb-2 text-md font-medium text-gray-900">
              Username
            </label>
            <input
              type="text"
              id="username"
              className={`bg-gray-50 border border-gray-300 text-gray-900 text-md rounded-md block w-full p-2.5 hover:border-blue
                ${errors.email ? "focus:outline-errorRed" : "focus:outline-blue"}`}
              placeholder="Masukkan username"
              required
              {...register("username", {
                required: {
                  value: true,
                  message: "Masukkan username",
                },
                minLength: {
                  value: 5,
                  message: "username minimal 5 karakter",
                },
                maxLength: {
                  value: 25,
                  message: "username maksimal 25 karakter",
                },
              })}
            />
            {errors.username && (
              <span className="font-medium t-2 text-xs text-red-600">
                {errors.username?.message}
              </span>
            )}
          </div>
          <div>
            <label htmlFor="email" className="block mb-2 text-md font-medium text-gray-900">
              Alamat email
            </label>
            <input
              type="email"
              id="email"
              className={`bg-gray-50 border border-gray-300 text-gray-900 text-md rounded-md block w-full p-2.5 hover:border-blue
                ${errors.email ? "focus:outline-errorRed" : "focus:outline-blue"}`}
              placeholder="Masukkan alamat email yang aktif"
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
              className={`bg-gray-50 border border-gray-300 text-gray-900 text-md rounded-md block w-full p-2.5 hover:border-blue
                ${errors.email ? "focus:outline-errorRed" : "focus:outline-blue"}`}
              placeholder="Kata sandi"
              required
              {...register("password", {
                required: {
                  value: true,
                  message: "Harap membuat kata sandi",
                },
                minLength: {
                  value: 5,
                  message: "Kata sandi harus minimal 5 huruf",
                },
                pattern: {
                  value: regPassword,
                  message: "Kata sandi harus terdapat minimal 1 huruf kecil dan angka atau simbol",
                },
              })}
            />
            {errors.password && (
              <span className="font-medium t-2 text-xs text-red-600">
                {errors.password?.message}
              </span>
            )}
          </div>
          <div>
            <label
              htmlFor="confirmPassword"
              className="block mb-2 text-md font-medium text-gray-900">
              Konfirmasi Kata sandi
            </label>
            <input
              type="password"
              id="confirmPassword"
              className={`bg-gray-50 border border-gray-300 text-gray-900 text-md rounded-md block w-full p-2.5 hover:border-blue
                ${errors.email ? "focus:outline-errorRed" : "focus:outline-blue"}`}
              placeholder="Konfirmasi kata sandi"
              required
              {...register("confirmPassword", {
                required: {
                  value: true,
                  message: "Konfirmasi kata sandi",
                },
                minLength: {
                  value: 5,
                  message: "Kata sandi harus minimal 5 huruf",
                },
                validate: (value) => {
                  const { password } = getValues();
                  return password === value || "Kata sandi tidak sama";
                },
              })}
            />
            {errors.confirmPassword && (
              <FormHelper
                textColor="danger"
                text={String(errors.confirmPassword?.message)}></FormHelper>
            )}
          </div>
          {/* end of form div */}
        </div>
        <div id="register-button" className="md:w-1/2 flex flex-col md:mx-auto space-y-2">
          <div id="auth-message">{errMessage && <Alert text={errMessage} type="danger" />}</div>
          <button
            type="submit"
            ref={ref}
            className="text-white text-center font-semibold bg-palepurple hover:bg-hovpalepurple focus:ring-1 focus:outline-none focus:ring-hovpalepurple rounded-md text-md px-4 py-3 w-full">
            Daftar
          </button>
        </div>
        <div className="grid grid-cols-1 text-center text-md space-y-2">
          <p>
            Sudah punya akun?{" "}
            <a className="text-blue hover:text-hovblue font-bold" href="/auth/login">
              Masuk
            </a>
          </p>
        </div>
      </form>
    </AuthLayout>
  );
}
