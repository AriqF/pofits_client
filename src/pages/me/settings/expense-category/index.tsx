import UserSettingsLayout from "@/components/layouts/user/settings";
import UserSettingsHeader from "@/components/layouts/user/settings/header-settings";
import NotFoundImage from "@/components/tools/alerts/notfound-image";
import LinkButton from "@/components/tools/button/link-button";
import UserSettingContentBox from "@/components/tools/container/user-settings-content-box";
import BaseList from "@/components/tools/list/base-list";
import DataList from "@/components/tools/list/master-data-list";
import { UserPath } from "@/utils/global/route-path";
import { baseAlertStyle, deleteAlertStyle } from "@/utils/global/style";
import { CustomAlert } from "@/utils/helper";
import { requestAxios } from "@/utils/helper/axios-helper";
import { baseUrl } from "@/utils/interfaces/constants";
import { ExpenseCategory, IncomeCategory } from "@/utils/interfaces/server-props";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { MdDelete, MdEditNote } from "react-icons/md";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

export default function UserExpenseCategory() {
  const [categories, setCategories] = useState<ExpenseCategory[]>([]);
  const swal = withReactContent(Swal);
  const router = useRouter();

  const getCategories = async () => {
    await requestAxios({
      url: baseUrl + "/expense-category/me",
      method: "GET",
    })
      .then((res) => {
        setCategories(res.data);
      })
      .catch((error) => {
        return CustomAlert();
      });
  };

  const deleteCategory = async (dataId: number | string) => {
    swal
      .fire({
        title: "Hapus Kategori?",
        icon: "warning",
        showCancelButton: true,
        showConfirmButton: true,
        confirmButtonText: "Hapus kategori",
        cancelButtonText: "Batal",
        ...deleteAlertStyle,
        ...deleteAlertStyle,
      })
      .then(async (res) => {
        if (res.isConfirmed) {
          await requestDeleteCategory(dataId);
        }
      });
  };

  const requestDeleteCategory = async (dataId: number | string) => {
    await requestAxios({
      url: baseUrl + "/expense-category/soft-delete/" + dataId,
      method: "DELETE",
    })
      .then(() => {
        return swal
          .fire({
            title: "Kategori berhasil dihapus",
            icon: "success",
            showConfirmButton: true,
            ...baseAlertStyle,
          })
          .then((res) => {
            if (res.isConfirmed) router.push("/me/settings/expense-category");
          });
      })
      .catch(() => {
        return CustomAlert({ linkToConfirm: UserPath.EXPENSE_CATEGORY });
      });
  };

  useEffect(() => {
    getCategories();
  }, []);

  return (
    <UserSettingsLayout backTo={UserPath.HOME}>
      <section id="user-expense-cat-index" className="space-y-4 col-span-3">
        <div className="space-y-3">
          <div className="space-y-1">
            <h3 className="text-2xl font-bold">Daftar Kategori Pengeluaran</h3>
            <p className="text-base text-gray-500">
              Kategori pengeluaran akan digunakan untuk mengelompokkan anggaran dan transaksi
              pengeluaran
            </p>
          </div>
          <LinkButton
            type="button"
            text={"Tambah"}
            color={"default"}
            linkTo={"expense-category/add"}
            className="w-full lg:w-[10%]"
          />
        </div>

        <section id="exp-category-list" className="flex flex-col">
          {categories.length > 0 ? (
            categories.map((category, index) => (
              <DataList
                key={index}
                dataPath={UserPath.EXPENSE_CATEGORY}
                icon={category.icon}
                title={category.title}
                dataId={category.id}>
                <Link
                  href={UserPath.EXPENSE_CATEGORY_EDIT + category.id}
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
        </section>
      </section>
    </UserSettingsLayout>
  );
}
