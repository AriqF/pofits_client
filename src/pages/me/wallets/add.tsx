import UserSettingsLayout from "@/components/layouts/user/settings";
import UserSettingsHeader from "@/components/layouts/user/settings/header-settings";
import DefaultButton from "@/components/tools/button";

export default function AddWallet() {
  return (
    <UserSettingsLayout>
      <section id="wallet-add ">
        <UserSettingsHeader backTo="/me/wallets">
          <h3 className="text-2xl font-bold">Tambah Dompet Manual</h3>
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
                  Nominal awal
                </label>
                <div className="flex">
                  <span className="inline-flex items-center px-3 text-sm text-gray-900 bg-gray-200 border border-r-0 border-gray-300 rounded-l-md ">
                    Rp
                  </span>
                  <input
                    type="number"
                    id="amount"
                    className="rounded-none rounded-r-lg bg-gray-50 border text-gray-900 hover:border-blue block flex-1 min-w-0 w-full text-md border-gray-300 p-2.5  "
                    placeholder="Nominal awal pada dompet"
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
                  placeholder="Deskripsi dengan singkat"
                  maxLength={255}
                  className={`bg-gray-50 border border-gray-300 text-gray-900 text-md rounded-md block w-full p-2.5 hover:border-blue`}
                />
              </div>
              <div id="register-button" className="md:w-1/2 flex flex-col md:mx-auto space-y-2">
                {/* <div id="auth-message">{errMessage && <Alert text={errMessage} type="danger" />}</div> */}
                <DefaultButton text="Simpan" color="default" type="submit" />
              </div>
            </div>
          </form>
        </div>
      </section>
    </UserSettingsLayout>
  );
}
