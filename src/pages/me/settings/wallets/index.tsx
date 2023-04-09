import UserSettingsLayout from "@/components/layouts/user/settings";
import UserSettingsHeader from "@/components/layouts/user/settings/header-settings";
import LinkButton from "@/components/tools/button/link-button";
import WalletAddButton from "@/components/tools/button/wallet-add-button";
import WalletListItem from "@/components/tools/list/page/wallet-list-card";
import { UserPath } from "@/utils/global/route-path";
import { deleteAlertStyle, baseAlertStyle } from "@/utils/global/style";
import { CustomAlert, numFormatter } from "@/utils/helper";
import { requestAxios } from "@/utils/helper/axios-helper";
import { baseUrl } from "@/utils/interfaces/constants";
import { ServerMessage } from "@/utils/interfaces/response-message";
import { WalletData } from "@/utils/interfaces/server-props";

import { useEffect, useState } from "react";
import { FaEye } from "react-icons/fa";
import { FiEye, FiEyeOff } from "react-icons/fi";

import {
  Md11Mp,
  MdAddCircleOutline,
  MdSwapHoriz,
  MdVisibility,
  MdVisibilityOff,
} from "react-icons/md";

export default function MyWallets() {
  const [wallets, setWallets] = useState<WalletData[]>([]);
  const [totalAmounts, setTotalAmounts] = useState("");
  const [showAmount, setShowAmount] = useState(false);

  const getWallets = async () => {
    await requestAxios({
      url: baseUrl + "/wallet/me",
      method: "GET",
    })
      .then((res) => {
        const wallets: WalletData[] = res.data;
        setWallets(wallets);
        let total: number = 0;
        wallets.map((wallet) => {
          total += Number(wallet.amount);
        });
        setTotalAmounts(numFormatter(total));
      })
      .catch((error) => {
        console.log(error);
        return CustomAlert({
          title: "Terjadi kesalahan dalam mengambil data",
          linkToConfirm: UserPath.SETTINGS,
        });
      });
  };

  useEffect(() => {
    getWallets();
  });

  return (
    <UserSettingsLayout backTo={UserPath.SETTINGS}>
      <section id="wallets-index" className="space-y-4 col-span-3">
        <div className="grid grid-col-3 grid-flow-col gap-2">
          <div className="space-y-4">
            <h3 className="text-2xl font-bold">Dompet Saya</h3>
            <div id="wallet-sub-header" className="mb-3">
              <h5 className="text-lg font-normal flex flex-col gap-y-1">
                Total saldo di semua dompet:{" "}
                <div className="inline-flex gap-x-2">
                  <button onClick={() => setShowAmount(!showAmount)}>
                    {showAmount ? (
                      <MdVisibility className="text-xl" />
                    ) : (
                      <MdVisibilityOff className="text-xl" />
                    )}
                  </button>
                  <span className="text-xl font-semibold text-gray-800">
                    Rp {showAmount ? totalAmounts : "*********"}
                  </span>
                </div>
              </h5>
            </div>
            <div className="flex flex-col md:flex-row gap-3" id="wallet-menu-buttons">
              <LinkButton
                linkTo={UserPath.WALLETS_ADD}
                type={"button"}
                text={"Tambah Dompet"}
                color={"default"}
                className="w-full md:w-1/5"
                icon={MdAddCircleOutline}
              />
              <LinkButton
                linkTo={UserPath.WALLETS_TRANSFER}
                type={"button"}
                text={"Pemindahan Dana"}
                color={"info"}
                className="w-full md:w-1/5"
                icon={MdSwapHoriz}
              />
            </div>
          </div>
        </div>

        <div
          id="wallet-list"
          className="grid grid-cols-1 gap-x-4 m-auto max-[300px]:grid-cols-1 max-[300px]:gap-y-3">
          {wallets.map((wallet, index) => (
            <WalletListItem
              icon={wallet.icon}
              id={wallet.id}
              key={index}
              name={wallet.name}
              category={wallet.category}
              linkToId={wallet.id}
            />
          ))}
        </div>
      </section>
    </UserSettingsLayout>
  );
}
