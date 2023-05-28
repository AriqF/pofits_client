import TransactionDetailHeader from "@/components/layouts/user/transaction/details/detail-header";
import TransactionDetails from "@/components/layouts/user/transaction/details/detail-template";
import { TransactionDetailItem } from "@/components/layouts/user/transaction/details/transaction-detail-item";
import TransactionLayout from "@/components/layouts/user/transaction/transaction-layout";
import DefaultButton from "@/components/tools/button";
import LinkButton from "@/components/tools/button/link-button";
import Container from "@/components/tools/container";
import { UserPath } from "@/utils/global/route-path";
import { baseAlertStyle, defaultButtonStyle, deleteAlertStyle } from "@/utils/global/style";
import { CustomAlert, numFormatter } from "@/utils/helper";
import { requestAxios } from "@/utils/helper/axios-helper";
import { baseUrl } from "@/utils/interfaces/constants";
import { IncomeTransactions } from "@/utils/interfaces/server-props";
import moment from "moment";
import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

export default function IncomeDetail() {
  const router = useRouter();
  const dataId = router.query.id;
  const swal = withReactContent(Swal);

  const [transData, setTransData] = useState<IncomeTransactions>({
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
      url: baseUrl + "/transaction/income/detail/" + dataId,
      method: "GET",
    })
      .then((res) => setTransData(res.data))
      .catch((error) => CustomAlert({ linkToConfirm: UserPath.TRANSACTION, text: error }));
  };

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
        await requestAxios({
          url: baseUrl + "/transaction/income/delete/" + dataId,
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
      });
  };

  useEffect(() => {
    if (router.isReady) {
      fetchTransactionDetail();
    }
  }, [router.isReady]);

  return (
    <TransactionDetails
      amount={transData.amount}
      type={"income"}
      icon={transData.category.icon}
      title={transData.title}
      wallet={transData.wallet?.name ? transData.wallet?.name : "-"}
      date={transData.date}
      category={transData.category.title}
      description={transData.description}
      dataId={router.query.id as string}
    />
  );
}
