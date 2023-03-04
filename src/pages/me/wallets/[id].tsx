import UserSettingsLayout from "@/components/layouts/user/settings";
import UserSettingsHeader from "@/components/layouts/user/settings/header-settings";
import Alert from "@/components/tools/alerts/alert";
import DefaultButton from "@/components/tools/button";
import LinkButton from "@/components/tools/button/link-button";
import { baseAlertStyle, deleteAlertStyle } from "@/utils/global/style";
import { numFormatter } from "@/utils/helper";
import { requestAxios } from "@/utils/helper/axios-helper";
import { baseUrl } from "@/utils/interfaces/constants";
import { ServerMessage } from "@/utils/interfaces/response-message";
import { WalletData } from "@/utils/interfaces/server-props";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { BiTransferAlt, BiTrash } from "react-icons/bi";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

export default function AddWallet() {
  const [isSuccess, setIsSuccess] = useState(false);
  const [isServerError, setIsServerError] = useState(false);
  const [errMessage, setErrMessage] = useState("");

  const router = useRouter();
  const walletId = router.query.id;
  const ref = useRef<any>();
  const swal = withReactContent(Swal);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<WalletData>();

  const getCurrentData = async () => {
    try {
      const response = await requestAxios({ url: baseUrl + "/wallet/" + walletId });
      // console.log(response.data);
      setValue("id", response.data.id);
      setValue("name", response.data.name);
      setValue("description", response.data.description);
      setValue("amount", numFormatter(response.data.amount));
      setValue("created_at", response.data.created_at);
      setValue("updated_at", response.data.updated_at);
    } catch (error) {
      console.log(error);
    }
  };

  const onSubmit: SubmitHandler<WalletData> = async (data: WalletData) => {
    setErrMessage("");
    await requestAxios({
      url: baseUrl + "/wallet/" + walletId,
      method: "PATCH",
      data: {
        name: data.name,
        description: data.description,
      },
    })
      .then((res) => {
        setIsSuccess(true);
        swal
          .fire({
            title: "Dompet berhasil disimpan!",
            icon: "success",
            ...baseAlertStyle,
          })
          .then((res) => {
            if (res.isConfirmed) router.push("/me/wallets");
          });
      })
      .catch((error) => {
        setIsServerError(true);
        error.response?.data?.message
          ? setErrMessage(error.response.data.message)
          : setErrMessage(ServerMessage.RequestError);
      });
  };

  const deleteWallet = async () => {
    swal
      .fire({
        title: "Hapus dompet?",
        icon: "warning",
        showCancelButton: true,
        showConfirmButton: true,
        confirmButtonText: "Hapus dompet",
        cancelButtonText: "Batal",
        ...deleteAlertStyle,
      })
      .then(async (res) => {
        if (res.isConfirmed) {
          await requestDeleteWallet()
            .then((res) => {
              swal
                .fire({
                  title: "Dompet berhasil dihapus",
                  icon: "success",
                  ...baseAlertStyle,
                })
                .then((res) => {
                  if (res.isConfirmed) router.push("/me/wallets");
                });
            })
            .catch((err) => {
              setIsServerError(true);
              err.response?.data?.message
                ? setErrMessage(err.response.data.message)
                : setErrMessage(ServerMessage.RequestError);
            });
        }
      });
  };

  const requestDeleteWallet = async () => {
    const response = await requestAxios({
      url: baseUrl + "/wallet/soft-delete/" + walletId,
      method: "DELETE",
    });
  };

  useEffect(() => {
    if (router.isReady) {
      getCurrentData();
    }
  }, [router.isReady]);

  return (
    <UserSettingsLayout>
      <section id="wallet-add ">
        <UserSettingsHeader backTo="/me/wallets">
          <div className="grid grid-cols-6 max-[350px]:flex flex-col max-[350px]:gap-y-2 ">
            <h3 className="text-2xl font-bold col-span-4">Ubah Dompet</h3>
            <button
              onClick={deleteWallet}
              title="Hapus data"
              className={
                "col-span-2 col-start-6 col-end-6 ml-auto text-white bg-errorRed hover:bg-hovErrorRed focus:ring-hovErrorRed text-center " +
                "font-semibold focus:ring-1 focus:outline-none rounded-md text-md px-4 py-3 w-full md:w-3/4 lg:w-1/2 max-[350px]:w-1/4 max-[350px]:mr-auto " +
                "max-[350px]:ml-0"
              }>
              <BiTrash className="text-2xl m-auto" />
            </button>
          </div>
        </UserSettingsHeader>
        <div className="bg-white border-gray-500 rounded-sm p-6 shadow-md min-h-screen md:min-h-fit flex flex-col gap-y-5">
          <form className="flex" onSubmit={handleSubmit(onSubmit)} ref={ref}>
            <div id="edit-wallet-form" className="flex flex-col gap-y-5 w-full">
              <div>
                <label htmlFor="title" className="block mb-2 text-md font-medium text-gray-900">
                  Nama Dompet
                </label>
                <input
                  type="text"
                  id="title"
                  placeholder="Berikan nama yang singkat"
                  className={`bg-gray-50 border border-gray-300 text-gray-900 text-md rounded-md block w-full p-2.5 hover:border-blue`}
                  {...register("name", {
                    required: "Nama dompet harus diisi",
                  })}
                />
              </div>
              <div>
                <label htmlFor="amount" className="block mb-2 text-md font-medium text-gray-900 ">
                  Nominal saat ini
                </label>
                <div className="flex">
                  <span className="inline-flex items-center px-3 text-sm text-gray-900 bg-gray-200 border border-r-0 border-gray-300 rounded-l-md ">
                    Rp
                  </span>
                  <input
                    disabled
                    type="text"
                    id="amount"
                    className="rounded-none rounded-r-lg bg-gray-50 border text-gray-900 focus:ring-blue-500 focus:border-blue-500 block flex-1 min-w-0 w-full text-md border-gray-300 p-2.5  "
                    {...register("amount")}
                  />
                </div>
              </div>
              <div>
                <label
                  htmlFor="description"
                  className="block mb-2 text-md font-medium text-gray-900">
                  Deskripsi {"(Optional)"}
                </label>
                <textarea
                  rows={2}
                  id="description"
                  placeholder="Deskripsi singkat dompet"
                  maxLength={255}
                  className={`bg-gray-50 border border-gray-300 text-gray-900 text-md rounded-md block w-full p-2.5 hover:border-blue`}
                  {...register("description", {
                    maxLength: {
                      value: 255,
                      message: "Deskripsi maksimal 255 karakter",
                    },
                  })}
                />
              </div>
              <div id="register-button" className="md:w-1/2 flex flex-col md:mx-auto space-y-2">
                <div id="auth-message">
                  {errMessage && <Alert text={errMessage} type="danger" />}
                </div>
                <DefaultButton text="Simpan" color="default" type="submit" />
                <div className="flex flex-row gap-x-3">
                  {/* <button
                    title="Pemindahan dana"
                    className="text-white bg-infoBlue hover:bg-hovInfoBlue focus:ring-hovInfoBlue text-center font-semibold focus:ring-1 focus:outline-none rounded-md text-md px-4 py-3 w-full">
                    <BiTransferAlt className="text-2xl m-auto" />
                  </button>
                  <button
                    title="Hapus data"
                    className="text-white bg-errorRed hover:bg-hovErrorRed focus:ring-hovErrorRed text-center font-semibold focus:ring-1 focus:outline-none rounded-md text-md px-4 py-3 w-full">
                    <BiTrash className="text-2xl m-auto" />
                  </button> */}
                </div>
              </div>
            </div>
          </form>
        </div>
      </section>
    </UserSettingsLayout>
  );
}
