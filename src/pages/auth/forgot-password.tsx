import AuthLayout from "@/components/layouts/auth";
import Alert from "@/components/tools/alerts/alert";
import InputForm from "@/components/tools/form/input-form";
import Spinner from "@/components/tools/spinner";
import { AuthPath, UserPath } from "@/utils/global/route-path";
import { baseFormStyle } from "@/utils/global/style";
import { baseUrl } from "@/utils/interfaces/constants";
import { regEmail } from "@/utils/interfaces/regex";
import { ServerMessage } from "@/utils/interfaces/response-message";
import axios from "axios";
import { useRouter } from "next/router";
import React, { useRef } from "react";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

interface FormState {
  email: string;
}

export default function ForgotPassword() {
  const [isSuccess, setIsSuccess] = useState(false);
  const [isServerError, setIsServerError] = useState(false);
  const [errMessage, setErrMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [values, setValues] = React.useState<FormState>({
    email: "",
  });

  const swal = withReactContent(Swal);
  const ref = useRef<any>();
  const router = useRouter();
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<FormState>();

  const onSubmit: SubmitHandler<FormState> = async (data: FormState) => {
    setErrMessage("");
    setSuccessMessage("");
    await axios(`${baseUrl}/auth/forgot-password`, {
      method: "POST",
      data: {
        email: data.email,
      },
    })
      .then((res) => {
        setIsSuccess(res.data.message);
        swal
          .fire({
            title: "Email telah berhasil dikirim",
            text: "Silahkan periksa email untuk instruksi pengaturan ulang kata sandi.",
            icon: "success",
            showConfirmButton: true,
          })
          .then((res) => {
            if (res.isConfirmed) router.push(AuthPath.LOGIN);
          });
      })
      .catch((err) => {
        setIsServerError(true);
        err.response?.data?.message
          ? setErrMessage(err.response?.data?.message)
          : setErrMessage(ServerMessage.RequestError);
      });
  };

  return (
    <AuthLayout headerText="Lupa kata sandi">
      <form className="space-y-6" onSubmit={handleSubmit(onSubmit)} ref={ref}>
        {/* <div>
          <p className="text-md font-normal">
            Lupa kata sandi anda? Kirim permintaan ubah kata sandi pada email anda
          </p>
        </div> */}
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
                  message: "Masukkan alamat email yang terdaftar",
                },
                pattern: {
                  value: regEmail,
                  message: "Harap masukkan alamat email yang sesuai",
                },
              })}
            />
          </InputForm>
        </div>
        <div id="forgot-button" className="md:w-full flex flex-col md:mx-auto space-y-2">
          <div id="auth-message" className="grid grid-cols-1">
            {errMessage && <Alert text={errMessage} type="danger" />}
            {successMessage && <Alert text={successMessage} type="success" />}
          </div>
          <button
            type="submit"
            ref={ref}
            className="text-white text-center font-semibold bg-palepurple hover:bg-hovpalepurple focus:ring-1 focus:outline-none focus:ring-hovpalepurple rounded-md text-md px-4 py-3 w-full">
            {isSubmitting ? <Spinner /> : ""}
            Kirim Permintaan
          </button>
        </div>
        <div className="grid grid-cols-1 text-center text-md space-y-2">
          <p>
            <a className="text-blue hover:text-hovblue font-bold" href="/auth/login">
              Kembali ke halaman masuk
            </a>
          </p>
        </div>
      </form>
    </AuthLayout>
  );
}
