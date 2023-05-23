import BudgetPageLayout from "@/components/layouts/user/budget/budget-layout";
import Container from "@/components/tools/container";
import { UserPath } from "@/utils/global/route-path";
import { CustomAlert, numFormatter } from "@/utils/helper";
import { requestAxios } from "@/utils/helper/axios-helper";
import { baseUrl } from "@/utils/interfaces/constants";
import { BudgetData, ExpenseTransactions, ProBudgetData } from "@/utils/interfaces/server-props";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import Image from "next/image";
import moment from "moment";
import BudgetCardDetail from "@/components/tools/card/budget-card-detail";
import BudgetTransactionCard from "@/components/tools/card/budget-transaction-card";
import withReactContent from "sweetalert2-react-content";
import Swal from "sweetalert2";
import { baseAlertStyle, deleteAlertStyle } from "@/utils/global/style";
import Alert from "@/components/tools/alerts/alert";
import { MdAdd } from "react-icons/md";
import Link from "next/link";

export default function BudgetDetail() {
  const [budget, setBudgetData] = useState<ProBudgetData>({
    amountRemaining: 0,
    amountUsed: 0,
    percentageUsed: 0,
    id: 0,
    amount: "",
    isRepeat: false,
    start_date: new Date(),
    end_date: new Date(),
    category: {
      id: 0,
      icon: "",
      title: "",
    },
    created_at: new Date(),
    updated_at: new Date(),
    created_by: {
      id: 0,
      firstname: "",
      lastname: "",
      email: "",
    },
  });
  const [transactionList, setTransactionList] = useState<ExpenseTransactions[]>([]);
  const router = useRouter();
  const dataId = router.query.id;
  const ref = useRef<any>();
  const swal = withReactContent(Swal);

  const getData = async () => {
    await requestAxios({
      url: baseUrl + "/budget/" + dataId,
      method: "GET",
    })
      .then((res) => {
        setBudgetData({
          ...res.data,
        });
        getTransactionData(res.data.category.id, res.data.start_date);
      })
      .catch((err) => {
        return CustomAlert({ linkToConfirm: UserPath.BUDGET });
      });
  };

  const getTransactionData = async (category: number, date: Date) => {
    await requestAxios({
      url: baseUrl + `/transaction/expense/monthly?date=${date}&category=${category}`,
      method: "GET",
    })
      .then((res) => {
        setTransactionList(res.data);
      })
      .catch((error) => {
        return CustomAlert({ linkToConfirm: UserPath.BUDGET });
      });
  };

  const requestDeleteBudget = async () => {
    await requestAxios({
      url: baseUrl + "/budget/soft-delete/" + dataId,
      method: "DELETE",
    })
      .then((res) => {
        swal
          .fire({
            title: "Anggaran berhasil dihapus",
            icon: "success",
            ...baseAlertStyle,
          })
          .then((res) => {
            if (res.isConfirmed) router.push(UserPath.BUDGET);
          });
      })
      .catch((error) => {
        swal
          .fire({
            title: "Anggaran gagal dihapus",
            icon: "error",
            ...baseAlertStyle,
          })
          .then((res) => {
            if (res.isConfirmed) router.push(UserPath.BUDGET);
          });
      });
  };

  const deleteBudget = async () => {
    swal
      .fire({
        title: "Hapus Anggaran?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Hapus",
        cancelButtonText: "Batal",
        ...deleteAlertStyle,
      })
      .then((res) => {
        if (res.isConfirmed) {
          requestDeleteBudget();
        }
      });
  };

  useEffect(() => {
    if (router.isReady) {
      getData();
    }
  }, [router.isReady]);

  return (
    <BudgetPageLayout backTo={UserPath.BUDGET}>
      <section className="flex flex-col col-span-2 w-full p-1 md:p-6 space-y-5 ">
        <div>
          <div className="inline-flex gap-x-4" id="budget-details-header">
            <div id="budget-head-left" className="inline-flex gap-x-4">
              <div className="rounded-full p-2 bg-gray-300">
                <Image
                  src={`/assets/icons/svg/${budget?.category.icon}.svg`}
                  alt="category-icon"
                  width={50}
                  height={50}
                  className="my-auto"
                />
              </div>
              <div className="flex flex-col my-auto">
                <h2 className="text-xl text-gray-800">{budget?.category.title}</h2>
                <p className="text-sm text-mute">
                  {moment(budget?.start_date).format("MMMM YYYY")}
                </p>
              </div>
            </div>
          </div>
          <div className="flex flex-col mt-4" id="budget-card-details">
            <BudgetCardDetail
              usedBudget={budget.amountUsed}
              budget={budget.amount}
              title={budget.category.title}
              icon={budget.category.icon}
              id={budget.id}
              date={budget.start_date}
              percentage={budget.percentageUsed}
              remaining={budget.amountRemaining}
              deleteFunc={deleteBudget}
            />
          </div>
        </div>
      </section>
      <section>
        <div className="flex flex-col col-span-1" id="budget-transactions">
          <div className="inline-flex justify-between mb-4">
            <h3 className="text-gray-600 text-xl font-semibold my-auto">Riwayat Transaksi</h3>
            <Link
              className="p-2 rounded-sm bg-gray-300 my-auto hover:bg-gray-200 cursor-pointer transition-all duration-200"
              href={UserPath.TRANSACTION_EXPENSE_ADD}>
              <MdAdd className="text-base" />
            </Link>
          </div>
          {/* LIST TRANSAKSI */}
          <div className="flex flex-col gap-y-4">
            {transactionList.length > 0 ? (
              transactionList.map((data, index) => (
                <BudgetTransactionCard
                  title={data.title}
                  wallet={data.wallet?.name ? data.wallet?.name : "-"}
                  icon={budget.category.icon}
                  date={data.created_at}
                  amount={data.amount}
                  dataId={data.id}
                  key={index}
                />
              ))
            ) : (
              <Alert text={"Belum ada transaksi"} type={"info"} size={"small"} />
            )}
          </div>
        </div>
      </section>
    </BudgetPageLayout>
  );
}
