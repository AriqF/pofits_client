import UserSettingsLayout from "@/components/layouts/user/settings";
import UserSettingsHeader from "@/components/layouts/user/settings/header-settings";
import DefaultButton from "@/components/tools/button";
import UserSettingContentBox from "@/components/tools/container/user-settings-content-box";
import UserSettingsDeleteBox from "@/components/tools/container/user-settings-delete-box";
import { baseAlertStyle, deleteButtonStyle } from "@/utils/global/style";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

export default function IncomeCategoryDetails() {
  const swal = withReactContent(Swal);

  const deleteCategory = () => {
    swal.fire({
      title: "Hapus kategori?",
      icon: "warning",
      showCancelButton: true,
      showConfirmButton: true,
      confirmButtonText: "Hapus kategori",
      cancelButtonText: "Batal",
      ...baseAlertStyle,
    });
  };

  return (
    <UserSettingsLayout>
      <UserSettingsHeader backTo="/me/income-category">
        <div className="grid grid-cols-6 max-[350px]:flex flex-col max-[350px]:gap-y-2 ">
          <h3 className="text-2xl font-bold col-span-4">Ubah kategori</h3>
        </div>
      </UserSettingsHeader>
      <UserSettingContentBox>
        <form className="flex">
          <div id="edit-incomecat-form" className="flex flex-col gap-y-5 w-full">
            <div>
              <label htmlFor="countries" className="block mb-2 text-md font-medium text-gray-900">
                Kategori Pemasukan
              </label>
              <select
                id="countries"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 cursor-pointer">
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
              <DefaultButton text="Simpan" color="default" type="submit" className="md:w-1/2" />
            </div>
          </div>
        </form>
      </UserSettingContentBox>
      <UserSettingsDeleteBox
        headerText="Hapus kategori"
        headerDesc="Kamu sudah tidak bisa menggunakan kategori ini untuk menambah kategori pada transaksi mu selanjutnya">
        <button onClick={deleteCategory} title="Hapus data" className={deleteButtonStyle}>
          {/* <BiTrash className="text-2xl m-auto" /> */}
          Hapus Data
        </button>
      </UserSettingsDeleteBox>
    </UserSettingsLayout>
  );
}
