import UserSettingsLayout from "@/components/layouts/user/settings";
import UserSettingsHeader from "@/components/layouts/user/settings/header-settings";
import DefaultButton from "@/components/tools/button";
import WalletAddButton from "@/components/tools/button/wallet-add-button";
import WalletListItem from "@/components/tools/card/wallet-list-card";
import { requestAxios } from "@/utils/helper/axios-helper";
import { baseUrl } from "@/utils/interfaces/constants";
import { WalletData } from "@/utils/interfaces/server-props";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { BiChevronLeft, BiListPlus } from "react-icons/bi";

export default function MyWallets() {
  const [wallets, setWallets] = useState<WalletData[]>([]);
  const router = useRouter();
  function stepBack() {
    return router.back();
  }

  const getWallets = async () => {
    try {
      const response = await requestAxios({
        url: baseUrl + "/wallet/me",
      });
      setWallets(response.data);
      ///think later
    } catch (error) {}
  };

  useEffect(() => {
    getWallets();
  }, []);

  return (
    <UserSettingsLayout>
      <section id="wallets-index" className="space-y-4">
        <UserSettingsHeader backTo="/me/settings">
          <div className="grid grid-col-3 grid-flow-col gap-2">
            <div className="space-y-3">
              <h3 className="text-2xl font-bold">Dompet Saya</h3>
              <div>
                <h5 className="text-lg font-normal flex flex-col gap-y-1">
                  Total saldo di semua dompet:{" "}
                  <span className="text-xl text-palepurple font-semibold">Rp 4.000.000</span>
                </h5>
              </div>
              <h3 className="text-blue hover:text-hovblue mt-2 font-semibold hover:underline">
                <a href="wallets/move-funds">Pemindahan Dana</a>
              </h3>
              {/* <button
                type="button"
                className="w-full md:w-1/6 text-white text-center bg-palepurple hover:bg-hovpalepurple focus:outline-none focus:ring-0 font-medium rounded-md text-sm p-2.5 md:p-2">
                <span className="">Pindahkan dana</span>
                <BiListPlus className="text-2xl m-auto inline-flex" />
              </button> */}
            </div>
          </div>
        </UserSettingsHeader>

        {/* <div className="bg-white border-gray-500 rounded-sm p-6 shadow-md min-h-fit">
          <h5 className="text-lg font-normal flex flex-col gap-y-1">
            Total saldo di semua dompet:{" "}
            <span className="text-xl text-palepurple font-semibold">Rp 4.000.000</span>
          </h5>
        </div> */}
        <div
          id="wallet-list"
          className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-x-4 gap-y-5 m-auto max-[300px]:grid-cols-1 max-[300px]:gap-y-3">
          <WalletAddButton />

          {wallets.map((wallet, index) => (
            <WalletListItem
              key={index}
              textHeader={wallet.name}
              amount={2000000}
              lastUpdated={"22/01/2023"}
              linkToId={wallet.id}
            />
          ))}
        </div>
      </section>
    </UserSettingsLayout>
  );
}
