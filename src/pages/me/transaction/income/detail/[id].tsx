import TransactionDetailHeader from "@/components/layouts/user/transaction/details/detail-header";
import TransactionDetails from "@/components/layouts/user/transaction/details/detail-template";
import { TransactionDetailItem } from "@/components/layouts/user/transaction/details/transaction-detail-item";
import TransactionLayout from "@/components/layouts/user/transaction/transaction-layout";
import DefaultButton from "@/components/tools/button";
import LinkButton from "@/components/tools/button/link-button";
import Container from "@/components/tools/container";
import { UserPath } from "@/utils/global/route-path";
import { defaultButtonStyle } from "@/utils/global/style";
import { numFormatter } from "@/utils/helper";
import moment from "moment";
import Image from "next/image";
import { useRouter } from "next/router";

export default function IncomeDetail() {
  const router = useRouter();
  const dataId = router.query.id;

  return (
    <TransactionDetails
      amount={5200000}
      type={"income"}
      icon={"loan"}
      title={"Gaji"}
      wallet={"BCA"}
      date={new Date("2023-04-03")}
      category={"Gaji"}
      dataId={router.query.id as string}
    />
  );
}
