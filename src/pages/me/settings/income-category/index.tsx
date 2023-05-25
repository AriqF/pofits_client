import UserSettingsLayout from "@/components/layouts/user/settings";
import UserSettingsHeader from "@/components/layouts/user/settings/header-settings";
import Alert from "@/components/tools/alerts/alert";
import NotFoundImage from "@/components/tools/alerts/notfound-image";
import LinkButton from "@/components/tools/button/link-button";
import ButtonToggleDown from "@/components/tools/button/toggle-down";
import UserSettingContentBox from "@/components/tools/container/user-settings-content-box";
import BaseList from "@/components/tools/list/base-list";
import DataList from "@/components/tools/list/master-data-list";
import { UserPath } from "@/utils/global/route-path";
import { baseAlertStyle, deleteAlertStyle } from "@/utils/global/style";
import { CustomAlert } from "@/utils/helper";
import { requestAxios } from "@/utils/helper/axios-helper";
import { baseUrl } from "@/utils/interfaces/constants";
import { IncomeCategory } from "@/utils/interfaces/server-props";
import Link from "next/link";
import { useEffect, useState } from "react";
import { MdDelete, MdEditNote } from "react-icons/md";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

export default function UserIncomeCategory() {
  const [categories, setCategories] = useState<IncomeCategory[]>([]);
  const swal = withReactContent(Swal);

  const getCategories = async () => {
    await requestAxios({
      url: baseUrl + "/income-category/me",
      method: "GET",
    })
      .then((res) => {
        setCategories(res.data);
      })
      .catch((error) => {
        return CustomAlert();
      });
  };
  const deleteCategory = (dataId: number | string | string[]) => {
    swal
      .fire({
        title: "Hapus kategori?",
        icon: "warning",
        showCancelButton: true,
        showConfirmButton: true,
        confirmButtonText: "Hapus kategori",
        cancelButtonText: "Batal",
        ...deleteAlertStyle,
      })
      .then(async (res) => {
        if (res.isConfirmed) {
          await requestAxios({
            url: baseUrl + "/income-category/soft-delete/" + dataId,
            method: "DELETE",
          })
            .then(() => {
              return swal.fire({
                title: "Kategori berhasil dihapus",
                icon: "success",
                showConfirmButton: true,
                ...baseAlertStyle,
              });
            })
            .catch((err) => {
              return swal.fire({
                title: "Kategori gagal dihapus",
                text: err,
                icon: "error",
                showConfirmButton: true,
                ...deleteAlertStyle,
              });
            });
        }
      });
  };

  useEffect(() => {
    getCategories();
  });

  return (
    <UserSettingsLayout backTo={UserPath.SETTINGS}>
      <section id="user-income-cat-index" className="flex flex-col gap-y-3 col-span-3 ">
        <div className="space-y-3">
          <div className="space-y-1">
            <h3 className="text-2xl font-bold">Daftar Kategori Pemasukan</h3>
            <p className="text-base text-gray-500">
              Kategori pemasukan akan digunakan untuk mengelompokkan estimasi dan transaksi
              pemasukkan
            </p>
          </div>
          <LinkButton
            type="button"
            text={"Tambah"}
            color={"default"}
            linkTo={"income-category/add"}
            className="w-full lg:w-[10%]"
          />
        </div>
        <div className="flex flex-col">
          {categories.length > 0 ? (
            categories.map((category, index) => (
              <DataList
                key={index}
                dataPath={UserPath.INCOME_CATEGORY_EDIT}
                icon={category.icon}
                title={category.title}
                subtitle={category.income_type}
                dataId={category.id}>
                <Link
                  href={UserPath.INCOME_CATEGORY_EDIT + category.id}
                  className="rounded-full p-2 bg-gray-500 my-auto  hover:bg-gray-400 transition-all duration-200">
                  <MdEditNote className="text-lg my-auto" />
                </Link>
                <Link
                  href="#"
                  onClick={() => deleteCategory(category.id)}
                  className="cursor-pointer rounded-full p-2 bg-gray-500 hover:bg-gray-400 my-auto  transition-all duration-200">
                  <MdDelete className="text-lg my-auto" />
                </Link>
              </DataList>
            ))
          ) : (
            <NotFoundImage text="Belum ada data" imageWidth={200} imageHeight={200} />
          )}
        </div>
      </section>
    </UserSettingsLayout>
  );
}
