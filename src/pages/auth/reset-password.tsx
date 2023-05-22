import AuthLayout from "@/components/layouts/auth";
import Alert from "@/components/tools/alerts/alert";
import FormHelper from "@/components/tools/alerts/form-helper";
import InputForm from "@/components/tools/form/input-form";
import Spinner from "@/components/tools/spinner";
import { AuthPath } from "@/utils/global/route-path";
import { baseFormStyle } from "@/utils/global/style";
import { baseUrl } from "@/utils/interfaces/constants";
import { regPassword } from "@/utils/interfaces/regex";
import { ServerMessage } from "@/utils/interfaces/response-message";
import axios from "axios";
import { useRouter } from "next/router";
import React, { useRef } from "react";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

interface FormState {
  password: string;
  confirmPassword: string;
}

export default function ResetPassword() {
  const [isSuccess, setIsSuccess] = useState(false);
  const [isServerError, setIsServerError] = useState(false);
  const [errMessage, setErrMessage] = useState("");
  const [values, setValues] = React.useState<FormState>({
    password: "",
    confirmPassword: "",
  });

  const ref = useRef<FormState>();
  const router = useRouter();
  const resetToken = router.query["token"];
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
    console.log(resetToken);
    setErrMessage("");
    await axios(baseUrl + "/auth/setup-password/" + resetToken, {
      method: "PATCH",
      data: {
        password: data.password,
        password_confirmation: data.confirmPassword,
      },
    })
      .then((res) => {
        setIsSuccess(res.data.message);
        swal
          .fire({
            title: "Kata sandi berhasil diubah",
            text: "Kamu sudah bisa masuk menggunakan kata sandi yang baru",
            icon: "success",
          })
          .then((res) => {
            if (res.isConfirmed) router.push(AuthPath.LOGIN);
          });
      })
      .catch((err) => {
        setIsServerError(true);
        err.response?.data?.message
          ? setErrMessage(err.response.data.message)
          : setErrMessage(ServerMessage.RequestError);
      });
  };

  return (
    <AuthLayout headerText="Atur ulang kata sandi">
      <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
        <div id="reset-password" className="space-y-4">
          <InputForm label={"Kata sandi baru"} id={"password"} errors={errors.password?.message}>
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
            label={"Konfirmasi kata sandi"}
            id={"confirmPassword"}
            errors={errors.confirmPassword?.message}>
            <input
              type="password"
              id="confirmPassword"
              className={
                baseFormStyle + (errors.password ? "border-errorRed focus:border-errorRed" : "")
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

          {/* end of form div */}
        </div>
        <div id="forgot-button" className="md:w-1/2 flex flex-col md:mx-auto space-y-2">
          <div id="auth-message">{errMessage && <Alert text={errMessage} type="danger" />}</div>
          <button
            type="submit"
            className="text-white text-center font-semibold bg-palepurple hover:bg-hovpalepurple focus:ring-1 focus:outline-none focus:ring-hovpalepurple rounded-md text-md px-4 py-3 w-full">
            {isSubmitting ? <Spinner /> : ""}
            Simpan
          </button>
        </div>
      </form>
    </AuthLayout>
  );
}
