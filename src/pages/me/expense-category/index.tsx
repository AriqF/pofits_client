import UserSettingsLayout from "@/components/layouts/user/settings";
import UserSettingsHeader from "@/components/layouts/user/settings/header-settings";
import LinkButton from "@/components/tools/button/link-button";
import UserSettingContentBox from "@/components/tools/container/user-settings-content-box";
import BaseList from "@/components/tools/list/base-list";

export default function UserExpenseCategory() {
  return (
    <UserSettingsLayout>
      <section id="user-expense-cat-index" className="space-y-4">
        <UserSettingsHeader backTo="/me/settings">
          <div className="grid grid-col-3 grid-flow-col gap-2">
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
                className="w-full sm:w-1/2 md:w-1/6"
              />
            </div>
          </div>
        </UserSettingsHeader>
        <UserSettingContentBox id="exp-category-list" className="grid grid-cols-1">
          <BaseList
            baseUrl="expense-category"
            id={"id"}
            header="Kategori A"
            shortDesc="Pengeluaran transportasi, bensin, servis, dan ojol"
          />
          <BaseList
            baseUrl="expense-category"
            id={"id"}
            header="Kategori B"
            shortDesc="Pengeluaran untuk makan sehari-hari"
          />
          <BaseList
            baseUrl="expense-category"
            id={"id"}
            header="Kategori C"
            shortDesc="Belanja kebutuhan sehari-hari"
          />
        </UserSettingContentBox>
      </section>
    </UserSettingsLayout>
  );
}
