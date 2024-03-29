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
import { AdminPath, AuthPath, UserPath } from "@/utils/global/route-path";
import InputForm from "@/components/tools/form/input-form";
import { baseAlertStyle, baseFormStyle, checkBoxStyle } from "@/utils/global/style";
import Spinner from "@/components/tools/spinner";
import Link from "next/link";
import { getMobileOS } from "@/utils/helper";
import withReactContent from "sweetalert2-react-content";
import Swal from "sweetalert2";
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
  const swal = withReactContent(Swal);

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
        cookies.set("accessToken", encodeURI(res.data.accessToken), {
          expires: new Date(decoded.exp * 1000),
          secure: true,
          path: encodeURI("/"),
        });
        res.data.role === "admin"
          ? router.replace(AdminPath.HOME).then(() => router.reload())
          : router.replace(UserPath.HOME).then(() => router.reload());
        // return NextResponse.next();
      })
      .catch((error: AxiosError<any>) => {
        SetIsServerError(true);
        // console.log(error);
        const clientOs = getMobileOS();
        // alert(clientOs);
        if (clientOs === "iOS") {
          return swal.fire({
            title: "Pengguna iOS?",
            icon: "question",
            ...baseAlertStyle,
            text: "Mohon maaf, untuk saat ini terjadi kesalahan pada sistem untuk sistem operasi iOS. Untuk sementara mohon untuk menggunakan sistem operasi lainnya",
          });
        }
        error.response?.data?.message
          ? SetErrMessage(error.response.data.message)
          : SetErrMessage(ServerMessage.RequestError);
      });
  };

  return (
    <AuthLayout headerText="Masuk">
      <form className="space-y-6" onSubmit={handleSubmit(onSubmit)} ref={ref}>
        <div id="login-form" className="space-y-4">
          <InputForm label={"Alamat email"} id={"email"} errors={errors.email?.message}>
            <input
              type="email"
              id="email"
              className={
                baseFormStyle + (errors.email ? "border-errorRed focus:border-errorRed" : "")
              }
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
          </InputForm>
          <InputForm label={"Kata sandi"} id={"password"} errors={errors.password?.message}>
            <input
              type="password"
              id="password"
              className={
                baseFormStyle + (errors.email ? "border-errorRed focus:border-errorRed" : "")
              }
              placeholder="Kata sandi"
              required
              {...register("password", {
                required: {
                  value: true,
                  message: "Masukkan kata sandi anda",
                },
              })}
            />
          </InputForm>
          <div>
            <div className="flex items-center">
              <input
                id="keepSigned"
                type="checkbox"
                {...register("isKeepSignedIn")}
                className={checkBoxStyle}
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
            {isSubmitting ? <Spinner /> : ""}
            Masuk
          </button>
        </div>
        <div className="grid grid-cols-1 text-center text-md space-y-2">
          <Link
            className="text-blue hover:text-hovblue font-bold w-fit m-auto"
            href={AuthPath.FORGOT_PASS}>
            Lupa kata sandi
          </Link>
          <p>
            Belum punya akun?{" "}
            <Link className="text-blue hover:text-hovblue font-bold" href={AuthPath.REGISTER}>
              Daftar
            </Link>
          </p>
        </div>
      </form>
    </AuthLayout>
  );
}
