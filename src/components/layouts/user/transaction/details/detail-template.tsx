import LinkButton from "@/components/tools/button/link-button";
import { UserPath } from "@/utils/global/route-path";
import { baseAlertStyle, defaultButtonStyle, deleteAlertStyle } from "@/utils/global/style";
import moment from "moment";
import TransactionLayout from "../transaction-layout";
import TransactionDetailHeader from "./detail-header";
import { TransactionDetailItem } from "./transaction-detail-item";
import { MouseEventHandler } from "react";
import { requestAxios } from "@/utils/helper/axios-helper";
import { baseUrl } from "@/utils/interfaces/constants";
import router from "next/router";
import withReactContent from "sweetalert2-react-content";
import Swal from "sweetalert2";
import DefaultButton from "@/components/tools/button";

interface Props {
  amount: number;
  type: "income" | "expense";
  icon: string;
  title: string;
  wallet: string;
  date: Date;
  category: string;
  dataId: number | string;
  description?: string;
  // deleteFunc: MouseEventHandler<HTMLAnchorElement>;
}

export default function TransactionDetails(props: Props) {
  const swal = withReactContent(Swal);
  let moduleEndpoint: string = "";
  if (props.type === "expense") moduleEndpoint = "expense";
  else if (props.type === "income") moduleEndpoint = "income";
  else moduleEndpoint = "";

  const submitDelete = async () => {
    swal
      .fire({
        title: "Hapus Transaksi?",
        icon: "question",
        ...deleteAlertStyle,
        showCancelButton: true,
        showConfirmButton: true,
        confirmButtonText: "Hapus",
        cancelButtonText: "Batal",
        ...deleteAlertStyle,
      })
      .then(async (res) => {
        if (res.isConfirmed) {
          await requestAxios({
            url: baseUrl + `/transaction/${props.type}/delete/` + props.dataId,
            method: "DELETE",
          }).then((res) => {
            return swal
              .fire({
                title: "Data Transaksi Berhasil Dihapus",
                icon: "success",
                ...baseAlertStyle,
              })
              .then((res) => {
                if (res.isConfirmed) return router.push(UserPath.TRANSACTION);
              });
          });
        }
      });
  };

  return (
    <TransactionLayout backTo={UserPath.TRANSACTION}>
      <section className="col-span-4 gap-8 flex flex-col h-max-fit mt-3 md:p-3">
        {/* <h2 className="text-xl font-bold text-left">Detail Transaksi</h2> */}
        <TransactionDetailHeader
          type={props.type}
          amount={props.amount}
          header={props.title}
          icon={props.icon}
        />
        <div id="detail-info" className="space-y-3">
          <TransactionDetailItem textLeft={"Sumber Akun"} textRight={props.wallet} />
          <TransactionDetailItem
            textLeft={"Tanggal Transaksi"}
            textRight={moment(props.date).format("DD MMMM YYYY")}
          />
          <TransactionDetailItem textLeft={"Kategori"} textRight={props.category} />
          <TransactionDetailItem
            textLeft={"Jenis"}
            textRight={props.type === "income" ? "Pemasukan" : "Pengeluaran"}
          />
          <div className="border-b border-gray-200 py-3 gap-2 justify-between flex flex-col">
            <p className="text-base text-mute text-left">Deskripsi</p>
            <p className="text-base text-left text-palepurple">
              {props.description ? props.description : "-"}
            </p>
          </div>
        </div>
        <div id="detail-interact" className="flex flex-col lg:flex-row lg:ml-auto gap-2">
          <div>
            <LinkButton
              className="w-full"
              type={"button"}
              text={"Edit"}
              color={"default"}
              linkTo={
                (props.type === "expense"
                  ? UserPath.TRANSACTION_EXPENSE_EDIT
                  : UserPath.TRANSACTION_INCOME_EDIT) + props.dataId
              }
            />
          </div>
          <div>
            <DefaultButton type={"button"} onClick={submitDelete} color={"danger"}>
              Hapus
            </DefaultButton>
          </div>
        </div>
      </section>
    </TransactionLayout>
  );
}
