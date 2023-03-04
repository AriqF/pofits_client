import UserSettingsLayout from "@/components/layouts/user/settings";
import UserSettingsHeader from "@/components/layouts/user/settings/header-settings";
import DefaultButton from "@/components/tools/button";
import UserSettingContentBox from "@/components/tools/container/user-settings-content-box";

export default function UserAddIncomeCategory() {
  return (
    <UserSettingsLayout>
      <UserSettingsHeader backTo="/me/income-category">
        <h3 className="text-2xl font-bold">Tambah Kategori Pemasukan</h3>
      </UserSettingsHeader>
      <UserSettingContentBox>
        <form className="flex">
          <div id="add-inccat-form" className="flex flex-col gap-y-5 w-full">
            <div>
              <label htmlFor="income-type" className="block mb-2 text-md font-medium text-gray-900">
                Kategori Pemasukan
              </label>
              <select
                id="income-type"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 cursor-pointer">
                <option value="none" selected disabled hidden>
                  Pilih jenis pemasukan
                </option>
                <option value={"Aktif"}>Aktif</option>
                <option value={"Pasif"}>Pasif</option>
              </select>
            </div>
            <div>
              <label htmlFor="title" className="block mb-2 text-md font-medium text-gray-900">
                Nama Kategori
              </label>
              <input
                type="text"
                id="title"
                placeholder="Berikan nama yang singkat"
                className={`bg-gray-50 border border-gray-300 text-gray-900 text-md rounded-md block w-full p-2.5 hover:border-blue`}
              />
            </div>
            <div>
              <label htmlFor="description" className="block mb-2 text-md font-medium text-gray-900">
                Deskripsi {"(Optional)"}
              </label>
              <textarea
                rows={2}
                id="description"
                placeholder="Deskripsi singkat kategori"
                maxLength={255}
                className={`bg-gray-50 border border-gray-300 text-gray-900 text-md rounded-md block w-full p-2.5 hover:border-blue`}
              />
            </div>
            <div id="add-incomecat-button" className="md:w-1/2 flex flex-col md:mx-auto space-y-2">
              {/* <div id="auth-message">{errMessage && <Alert text={errMessage} type="danger" />}</div> */}
              <DefaultButton text="Simpan" color="default" type="submit" />
            </div>
          </div>
        </form>
      </UserSettingContentBox>
    </UserSettingsLayout>
  );
}
