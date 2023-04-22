import { UserPath } from "@/utils/global/route-path";
import { deleteAlertStyle, baseAlertStyle } from "@/utils/global/style";
import { CustomAlert, numFormatter } from "@/utils/helper";
import { requestAxios } from "@/utils/helper/axios-helper";
import { baseUrl } from "@/utils/interfaces/constants";
import Image from "next/image";
import router from "next/router";
import { MouseEventHandler } from "react";
import { MdEditNote, MdDelete } from "react-icons/md";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import DataList from "../master-data-list";

interface CardProps {
  icon: string;
  id: number | string;
  name: string;
  category: string;
  linkToId: string | number;
  deleteFunc?: MouseEventHandler<HTMLAnchorElement>;
}

export default function WalletListItem(props: CardProps) {
  const swal = withReactContent(Swal);
  const deleteWallet = async (walletId: number | string) => {
    swal
      .fire({
        title: "Hapus dompet?",
        icon: "warning",
        showCancelButton: true,
        showConfirmButton: true,
        confirmButtonText: "Hapus dompet",
        cancelButtonText: "Batal",
        ...deleteAlertStyle,
      })
      .then(async (res) => {
        if (res.isConfirmed) {
          await requestDeleteWallet(walletId)
            .then((res) => {
              swal.fire({
                title: "Dompet berhasil dihapus",
                icon: "success",
                ...baseAlertStyle,
              });
              // .then((res) => {
              //   if (res.isConfirmed) router.reload();
              // });
            })
            .catch((err) => {
              return CustomAlert({ linkToConfirm: UserPath.SETTINGS });
            });
        }
      });
  };

  const requestDeleteWallet = async (walletId: number | string) => {
    const response = await requestAxios({
      url: baseUrl + "/wallet/soft-delete/" + walletId,
      method: "DELETE",
    });
  };
  return (
    <DataList
      dataPath={UserPath.WALLETS}
      icon={props.icon}
      title={props.name}
      subtitle={props.category}
      dataId={props.id}>
      <a
        href={UserPath.WALLETS_EDIT + props.id}
        className="rounded-full p-2 bg-gray-500 my-auto  hover:bg-gray-400 transition-all duration-200">
        <MdEditNote className="text-lg my-auto" />
      </a>
      <a
        href="#"
        onClick={() => deleteWallet(props.id)}
        className="cursor-pointer rounded-full p-2 bg-gray-500 hover:bg-gray-400 my-auto  transition-all duration-200">
        <MdDelete className="text-lg my-auto" />
      </a>
    </DataList>
  );
}
