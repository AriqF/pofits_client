import UserSettingsLayout from "@/components/layouts/user/settings";
import UserSettingsHeader from "@/components/layouts/user/settings/header-settings";
import LinkButton from "@/components/tools/button/link-button";
import UserSettingContentBox from "@/components/tools/container/user-settings-content-box";
import BaseList from "@/components/tools/list/base-list";

export default function UserIncomeCategory() {
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
        <UserSettingContentBox id="inc-category-list" className="grid grid-cols-1">
          <BaseList
            baseUrl="income-category"
            id={"id"}
            header="Kategori A"
            subHeader="Pemasukan Aktif"
            shortDesc="Pemasukan dari kantor tiap bulan"
          />
          <BaseList
            baseUrl="income-category"
            id={"id"}
            header="Kategori B"
            subHeader="Pemasukan Aktif"
            shortDesc="Pemasukan dari freelance"
          />
          <BaseList
            baseUrl="income-category"
            id={"id"}
            header="Kategori C"
            subHeader="Pemasukan Pasif"
            shortDesc="Hasil kontrakan dan kos-kosan"
          />
        </UserSettingContentBox>
      </section>
    </UserSettingsLayout>
  );
}
