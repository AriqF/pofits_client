import UserBaseLayout from "@/components/layouts/user/layouts";
import Avatar from "@/components/tools/avatar";
import InputForm from "@/components/tools/form/input-form";
import { UserPath } from "@/utils/global/route-path";
import { baseAlertStyle, baseFormStyle, defaultButtonStyle } from "@/utils/global/style";
import { CustomAlert } from "@/utils/helper";
import { requestAxios } from "@/utils/helper/axios-helper";
import { baseUrl } from "@/utils/interfaces/constants";
import { regEmail } from "@/utils/interfaces/regex";
import { UpdateProfileForm, User } from "@/utils/interfaces/server-props";
import moment from "moment";
import { useRouter } from "next/router";
import { ReactNode, useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { MdChevronLeft } from "react-icons/md";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

export default function UserProfileSettings() {
  const router = useRouter();
  const swal = withReactContent(Swal);
  const [user, setUser] = useState<User>({
    id: 0,
    firstname: "",
    lastname: "",
    email: "",
    status: 1,
    role: "user",
    last_iat: 0,
    created_at: new Date(),
  });

  const fetchUserProfile = async () => {
    await requestAxios({
      url: baseUrl + "/user/me",
      method: "GET",
    }).then((res) => {
      setUser(res.data);
      setValue("firstname", res.data.firstname);
      setValue("lastname", res.data.lastname);
      setValue("email", res.data.email);
    });
  };

  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors, isSubmitting },
  } = useForm<UpdateProfileForm>();

  const submitHandler: SubmitHandler<UpdateProfileForm> = async (data: UpdateProfileForm) => {
    await requestAxios({
      url: baseUrl + "/user/profile",
      method: "PATCH",
      data: {
        firstname: data.firstname,
        lastname: data.lastname,
      },
    })
      .then((res) => {
        swal
          .fire({
            title: "Profil berhasil dirubah",
            icon: "success",
            ...baseAlertStyle,
          })
          .then((res) => {
            if (res.isConfirmed) {
              router.reload();
              router.push(UserPath.PROFILE);
            }
          });
      })
      .catch((error) => {
        return CustomAlert({ linkToConfirm: UserPath.PROFILE });
      });
  };

  useEffect(() => {
    fetchUserProfile();
  }, []);

  // COMPONENTS
  const ProfileSection = () => {
    return (
      <section id="profile-info" className="flex flex-col gap-y-4">
        <h5 className="text-lg font-semibold text-gray-800">Profil Saya</h5>
        <div className="flex flex-row gap-3">
          <Avatar
            name={user.firstname + " " + user.lastname}
            round={true}
            bgColor={"bg-palepurple"}
            className="w-20 h-20 flex"
            textClassName="text-2xl"
          />
          <div className="flex flex-col my-auto">
            <h5 className="text-xl capitalize ">
              {user.firstname} {user.lastname}
            </h5>
            <p className="text-sm text-gray-600">
              Member sejak {moment(user.created_at).format("D MMMM YYYY")}
            </p>
          </div>
        </div>
      </section>
    );
  };

  const PersonalSection = () => {
    return (
      <section id="profile-info" className="flex flex-col gap-y-4">
        <h5 className="text-lg font-semibold text-gray-800">Informasi Personal</h5>
        <form className="flex flex-col gap-4" onSubmit={handleSubmit(submitHandler)}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <InputForm label={"Nama Depan"} id={"firstname"} errors={errors.firstname?.message}>
              <input
                type="text"
                id="firstname"
                placeholder="Nama depan"
                className={
                  baseFormStyle + (errors.firstname ? "border-errorRed focus:border-errorRed" : "")
                }
                {...register("firstname", {
                  required: "Nama depan harus diisi",
                  minLength: {
                    value: 2,
                    message: "Nama depan minimal 2 karakter",
                  },
                  maxLength: {
                    value: 256,
                    message: "Nama depan maksimal 256 karakter",
                  },
                })}
              />
            </InputForm>
            <InputForm label={"Nama Belakang"} id={"lastname"} errors={errors.lastname?.message}>
              <input
                type="text"
                id="lastname"
                placeholder="Nama belakang"
                className={
                  baseFormStyle + (errors.lastname ? "border-errorRed focus:border-errorRed" : "")
                }
                {...register("lastname", {
                  required: "Nama belakang harus diisi",
                  minLength: {
                    value: 2,
                    message: "Nama belakang minimal 2 karakter",
                  },
                  maxLength: {
                    value: 256,
                    message: "Nama belakang maksimal 256 karakter",
                  },
                })}
              />
            </InputForm>
            <InputForm label={"Alamat Email"} id={"email"} errors={errors.email?.message}>
              <input
                disabled
                type="email"
                id="email"
                placeholder="someone@mail.com"
                className={
                  "text-gray-400 bg-[#f2f2f2] " +
                  baseFormStyle +
                  (errors.email ? "border-errorRed focus:border-errorRed" : "")
                }
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
          </div>
          <button
            type="submit"
            className={
              "border bg-palepurple text-white hover:bg-hovpalepurple mt-3 " +
              "inline-flex place-content-center text-center font-semibold focus:ring-1 focus:outline-none " +
              "rounded-md text-md px-4 py-3 w-full m-auto transition-colors duration-200 " +
              "w-full md:w-[20%]"
            }>
            Simpan
          </button>
        </form>
      </section>
    );
  };

  const PrivacyBox = () => {
    return (
      <section className="rounded-md border border-palepurple p-3 flex flex-col lg:flex-row gap-3 justify-between">
        <div className="flex flex-col">
          <h4 className="text-lg text-gray-800 font-semibold">Ubah kata sandi</h4>
          <p className="text-sm text-gray-600">
            Direkomendasikan untuk merubah kata sandi setiap 2 bulan sekali
          </p>
        </div>
        <div className="my-auto">
          <a
            href={UserPath.PROFILE_PRIVACY}
            className={"bg-blue hover:bg-hovblue text-white" + defaultButtonStyle}>
            Ubah kata sandi
          </a>
        </div>
      </section>
    );
  };

  return (
    <ProfileLayout backTo={UserPath.HOME}>
      <h2 className="text-2xl text-gray-600">Pengaturan Akun</h2>
      <ProfileSection />
      <PersonalSection />
      <PrivacyBox />
    </ProfileLayout>
  );
}

interface Props {
  backTo: string;
  children: ReactNode;
}
export const ProfileLayout = (props: Props) => {
  return (
    <UserBaseLayout>
      <header className="p-0 min-h-fit inline-flex flex-col gap-y-4 mb-4 md:mb-2">
        <a
          href={props.backTo}
          className="text-blue hover:text-hovblue font-semibold inline-flex cursor-pointer">
          <MdChevronLeft className="my-auto text-2xl" /> <p>Kembali</p>
        </a>
      </header>
      <section className={"min-h-screen lg:mb-0 space-y-6"}>{props.children}</section>
    </UserBaseLayout>
  );
};
