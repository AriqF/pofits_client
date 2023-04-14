import TransactionDetailHeader from "@/components/layouts/user/transaction/details/detail-header";
import TransactionDetails from "@/components/layouts/user/transaction/details/detail-template";
import { TransactionDetailItem } from "@/components/layouts/user/transaction/details/transaction-detail-item";
import TransactionLayout from "@/components/layouts/user/transaction/transaction-layout";
import DefaultButton from "@/components/tools/button";
import LinkButton from "@/components/tools/button/link-button";
import Container from "@/components/tools/container";
import { UserPath } from "@/utils/global/route-path";
import { defaultButtonStyle } from "@/utils/global/style";
import { CustomAlert, numFormatter } from "@/utils/helper";
import { requestAxios } from "@/utils/helper/axios-helper";
import { baseUrl } from "@/utils/interfaces/constants";
import { ExpenseTransactions } from "@/utils/interfaces/server-props";
import moment from "moment";
import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function ExpenseDetail() {
  const [transData, setTransData] = useState<ExpenseTransactions>({
    amount: 0,
    category: { icon: "", id: 0, title: "-" },
    wallet: { name: "-", id: 0 },
    id: 0,
    date: new Date(),
    title: "-",
    description: "-",
    created_at: new Date(),
  });

  const fetchTransactionDetail = async () => {
    await requestAxios({
      url: baseUrl + "/transaction/expense/detail/" + dataId,
      method: "GET",
    })
      .then((res) => setTransData(res.data))
      .catch((error) => CustomAlert({ linkToConfirm: UserPath.TRANSACTION, text: error }));
  };

  const router = useRouter();
  const dataId = router.query.id;

  useEffect(() => {
    if (router.isReady) {
      fetchTransactionDetail();
    }
  }, [router.isReady]);

  return (
    <TransactionDetails
      amount={transData.amount}
      type={"expense"}
      icon={transData.category.icon}
      title={transData.title}
      wallet={transData.wallet?.name ? transData.wallet?.name : "-"}
      date={transData.created_at}
      category={transData.category.title}
      dataId={router.query.id as string}
    />
  );
}
