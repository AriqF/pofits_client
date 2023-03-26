import UserSettingsLayout from "@/components/layouts/user/settings";
import UserSettingsHeader from "@/components/layouts/user/settings/header-settings";
import LinkButton from "@/components/tools/button/link-button";
import ButtonToggleDown from "@/components/tools/button/toggle-down";
import UserSettingContentBox from "@/components/tools/container/user-settings-content-box";
import BaseList from "@/components/tools/list/base-list";
import { CustomAlert } from "@/utils/helper";
import { requestAxios } from "@/utils/helper/axios-helper";
import { baseUrl } from "@/utils/interfaces/constants";
import { IncomeCategory } from "@/utils/interfaces/server-props";
import { useEffect, useState } from "react";

export default function UserIncomeCategory() {
  const [categories, setCategories] = useState<IncomeCategory[]>([]);

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

  useEffect(() => {
    getCategories();
  }, []);

  // const useToggle = (initialState: any) => {
  //   const [toggleValue, setToggleValue] = useState(initialState);

  //   const toggler = () => {
  //     setToggleValue(!toggleValue);
  //   };
  //   return [toggleValue, toggler];
  // };
  // const [toggle, setToggle] = useToggle(true);

  return (
    <UserSettingsLayout>
      <section id="user-income-cat-index" className="space-y-4">
        <UserSettingsHeader backTo="/me/settings">
          <div className="grid grid-col-3 grid-flow-col gap-2">
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
                className="w-full sm:w-1/2 md:w-1/6"
              />
            </div>
          </div>
        </UserSettingsHeader>
        <UserSettingContentBox id="inc-category-list" className="grid grid-cols-1 md:grid-cols-1 ">
          {/* <h5 className="text-xl text-gray-900 font-semibold mb-2">Kategori Kustom</h5> */}
          {categories.map((category, index) => (
            <BaseList
              key={index}
              baseUrl="income-category"
              id={category.id}
              header={category.title}
              subHeader={"Pemasukan " + category.income_type}
              // shortDesc={category.description}
            />
          ))}
        </UserSettingContentBox>
      </section>
    </UserSettingsLayout>
  );
}
