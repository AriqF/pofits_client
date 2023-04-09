import LinkButton from "@/components/tools/button/link-button";
import { UserPath } from "@/utils/global/route-path";
import { defaultButtonStyle } from "@/utils/global/style";
import moment from "moment";
import TransactionLayout from "../transaction-layout";
import TransactionDetailHeader from "./detail-header";
import { TransactionDetailItem } from "./transaction-detail-item";

interface Props {
  amount: number;
  type: "income" | "expense";
  icon: string;
  title: string;
  wallet: string;
  date: Date;
  category: string;
  dataId: number | string;
}

export default function TransactionDetails(props: Props) {
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
        </div>
        <div id="detail-interact" className="flex flex-row md:flex-row md:ml-auto md:w-[30%] gap-2">
          <LinkButton type={"button"} text={"Edit"} color={"default"} linkTo={"#"} />
          <button
            type="button"
            className={
              defaultButtonStyle +
              " border border-moneyDanger text-moneyDanger bg-transparent hover:bg-moneyDanger hover:text-white"
            }>
            Hapus
          </button>
        </div>
      </section>
    </TransactionLayout>
  );
}
