import AuthLayout from "@/components/layouts/auth";
import Alert from "@/components/tools/alerts/alert";
import FormHelper from "@/components/tools/alerts/form-helper";
import InputForm from "@/components/tools/form/input-form";
import { AuthPath, UserPath } from "@/utils/global/route-path";
import { baseFormStyle } from "@/utils/global/style";
import { baseUrl } from "@/utils/interfaces/constants";
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

  const onSubmit: SubmitHandler<FormState> = async (data: FormState) => {
    setErrMessage("");
    await axios(`${baseUrl}/auth/register`, {
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
            if (res.isConfirmed) router.push(AuthPath.LOGIN);
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
          <InputForm label={"Username"} id={"username"} errors={errors.username?.message}>
            <input
              type="text"
              className={
                baseFormStyle + (errors.username ? "border-errorRed focus:border-errorRed" : "")
              }
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
          </InputForm>
          <InputForm label={"Email"} id={"email"} errors={errors.email?.message}>
            <input
              type="email"
              className={
                baseFormStyle + (errors.email ? "border-errorRed focus:border-errorRed" : "")
              }
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
          </InputForm>
          <InputForm label={"Kata sandi"} id={"password"} errors={errors.password?.message}>
            <input
              type="password"
              id="password"
              className={
                baseFormStyle + (errors.password ? "border-errorRed focus:border-errorRed" : "")
              }
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
          </InputForm>
          <InputForm
            label={"Konfirmasi Kata sandi"}
            id={"confirm_password"}
            errors={errors.confirmPassword?.message}>
            <input
              type="password"
              id="confirmPassword"
              className={
                baseFormStyle +
                (errors.confirmPassword ? "border-errorRed focus:border-errorRed" : "")
              }
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
          </InputForm>
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
            <a className="text-blue hover:text-hovblue font-bold" href={AuthPath.LOGIN}>
              Masuk
            </a>
          </p>
        </div>
      </form>
    </AuthLayout>
  );
}
