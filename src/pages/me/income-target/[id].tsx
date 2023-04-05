import BudgetPageLayout from "@/components/layouts/user/budget/budget-layout";
import { UserPath } from "@/utils/global/route-path";
import { CustomAlert } from "@/utils/helper";
import { requestAxios } from "@/utils/helper/axios-helper";
import { baseUrl } from "@/utils/interfaces/constants";
import {
  IncomeEstimationData,
  IncomeTransactions,
  Transactions,
} from "@/utils/interfaces/server-props";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Image from "next/image";
import moment from "moment";
import IncomeTargetCardDetails from "@/components/tools/card/income-target/income-target-card-detail";
import { TextBadge } from "@/components/tools/badges/text-badge";
import withReactContent from "sweetalert2-react-content";
import Swal from "sweetalert2";
import { baseAlertStyle, deleteAlertStyle } from "@/utils/global/style";
import BudgetTransactionCard from "@/components/tools/card/budget-transaction-card";
import IncomeTargetTransCard from "@/components/tools/card/income-target/income-target-transactions-card";
import Alert from "@/components/tools/alerts/alert";
import { MdAdd } from "react-icons/md";

export default function TargetIncomeDetails() {
  const [target, setTarget] = useState<IncomeEstimationData>({
    amountAchieved: 0,
    percentageAchieved: 0,
    amountUnachieved: 0,
    isAchieved: false,
    id: 0,
    amount: 0,
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
      username: "",
      email: "",
    },
  });
  const [transactionList, setTransactionList] = useState<IncomeTransactions[]>([]);
  const router = useRouter();
  const dataId = router.query.id;
  const swal = withReactContent(Swal);

  const getTargetDetails = async () => {
    await requestAxios({
      url: baseUrl + "/income-estimation/" + dataId,
      method: "GET",
    })
      .then((res) => {
        setTarget({ ...res.data });
        getTransactions(res.data.category.id, res.data.start_date);
      })
      .catch((error) => {
        CustomAlert({ linkToConfirm: UserPath.ESTIMATION, text: error });
      });
  };

  const getTransactions = async (category: number, date: Date) => {
    await requestAxios({
      url: baseUrl + `/transaction/income/monthly?date=${date}&category=${category}`,
      method: "GET",
    })
      .then((res) => {
        setTransactionList(res.data);
      })
      .catch((error) => {
        return CustomAlert({ linkToConfirm: UserPath.ESTIMATION, text: error });
      });
  };

  const requestDeleteData = async () => {
    await requestAxios({
      url: baseUrl + "/income-estimation/soft-delete/" + dataId,
      method: "DELETE",
    })
      .then((res) => {
        swal
          .fire({
            title: "Target pemasukan berhasil dihapus",
            icon: "success",
            ...baseAlertStyle,
          })
          .then((res) => {
            if (res.isConfirmed) router.push(UserPath.ESTIMATION);
          });
      })
      .catch((error) => {
        swal
          .fire({
            title: "Target pemasukan gagal dihapus",
            icon: "error",
            ...baseAlertStyle,
          })
          .then((res) => {
            if (res.isConfirmed) router.push(UserPath.ESTIMATION);
          });
      });
  };

  const deleteData = () => {
    swal
      .fire({
        title: "Hapus Target Pemasukan?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Hapus",
        cancelButtonText: "Batal",
        ...deleteAlertStyle,
      })
      .then((res) => {
        if (res.isConfirmed) {
          requestDeleteData();
        }
      });
  };

  useEffect(() => {
    if (router.isReady) {
      getTargetDetails();
    }
  }, [router.isReady]);

  return (
    <BudgetPageLayout backTo={UserPath.ESTIMATION}>
      <section className="flex flex-col col-span-2 w-full p-1 md:p-6 space-y-5 ">
        <div>
          <div className="inline-flex gap-x-4" id="target-details-header">
            <div id="budget-head-left" className="inline-flex gap-x-4">
              <div className="rounded-full p-2 bg-gray-300">
                <Image
                  src={`/assets/icons/svg/${target?.category.icon}.svg`}
                  alt="category-icon"
                  width={50}
                  height={50}
                  className="my-auto"
                />
              </div>
              <div className="flex flex-col my-auto">
                <div className="inline-flex gap-3">
                  <h2 className="text-xl text-gray-800 font-medium">{target.category.title}</h2>
                  <TextBadge
                    color={target.isAchieved ? "success" : "warning"}
                    text={target.isAchieved ? "Tercapai" : "Belum tercapai"}
                    className="text-xs"
                  />
                </div>
                <p className="text-sm text-mute">
                  {moment(target?.start_date).format("MMMM YYYY")}
                </p>
              </div>
            </div>
          </div>
          <div className="flex flex-col mt-4" id="target-card-details">
            <IncomeTargetCardDetails
              title={target.category.title}
              icon={target.category.icon}
              id={target.id}
              date={target.start_date}
              percentage={target.percentageAchieved}
              achieved={target.amountAchieved}
              unachived={target.amountUnachieved}
              target={target.amount}
              deleteFunc={deleteData}
            />
          </div>
        </div>
      </section>
      <section>
        <div className="flex flex-col col-span-1" id="budget-transactions">
          <div className="inline-flex justify-between mb-4">
            <h3 className="text-gray-600 text-xl font-semibold my-auto">Riwayat Transaksi</h3>
            <a
              className="p-2 rounded-sm bg-gray-300 my-auto hover:bg-gray-200 cursor-pointer transition-all duration-200"
              href={UserPath.TRANSACTION_INCOME_ADD}>
              <MdAdd className="text-base" />
            </a>
          </div>
          {/* LIST TRANSAKSI */}
          <div className="flex flex-col gap-y-4">
            {transactionList.length > 0 ? (
              transactionList.map((data, index) => (
                <IncomeTargetTransCard
                  dataId={data.id}
                  title={data.title}
                  wallet={data.wallet.name}
                  icon={target.category.icon}
                  date={data.created_at}
                  amount={data.amount}
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
