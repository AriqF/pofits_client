import UserSettingsLayout from "@/components/layouts/user/settings";
import UserSettingsHeader from "@/components/layouts/user/settings/header-settings";
import DefaultButton from "@/components/tools/button";
import LinkButton from "@/components/tools/button/link-button";
import { numFormatter } from "@/utils/helper";
import { BiTransferAlt, BiTrash } from "react-icons/bi";

export default function AddWallet() {
  return (
    <UserSettingsLayout>
      <section id="wallet-add ">
        <UserSettingsHeader backTo="/me/wallets">
          <div className="grid grid-cols-6 max-[350px]:flex flex-col max-[350px]:gap-y-2 ">
            <h3 className="text-2xl font-bold col-span-4">Ubah Dompet</h3>
            <button
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
          <form className="flex">
            <div id="add-wallet-form" className="flex flex-col gap-y-5 w-full">
              <div>
                <label htmlFor="title" className="block mb-2 text-md font-medium text-gray-900">
                  Nama Dompet
                </label>
                <input
                  type="text"
                  id="title"
                  placeholder="Berikan nama yang singkat"
                  className={`bg-gray-50 border border-gray-300 text-gray-900 text-md rounded-md block w-full p-2.5 hover:border-blue`}
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
                    value={numFormatter(2000000)}
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
                />
              </div>
              <div id="register-button" className="md:w-1/2 flex flex-col md:mx-auto space-y-2">
                {/* <div id="auth-message">{errMessage && <Alert text={errMessage} type="danger" />}</div> */}
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
