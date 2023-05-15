import GoalsLayout from "@/components/layouts/user/finance-goals/goals-layout";
import Alert from "@/components/tools/alerts/alert";
import ProgressBar from "@/components/tools/bar/progress-bar";
import { UserPath } from "@/utils/global/route-path";
import { baseAlertStyle, defaultButtonStyle, deleteAlertStyle } from "@/utils/global/style";
import {
  CustomAlert,
  currencyFormatter,
  getGoalFrequenceStr,
  getGoalSeverityStr,
} from "@/utils/helper";
import { requestAxios } from "@/utils/helper/axios-helper";
import { baseUrl } from "@/utils/interfaces/constants";
import { FinanceGoal, GoalSavingHistory } from "@/utils/interfaces/server-props";
import { error } from "console";
import moment from "moment";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { MdAdd, MdCheck } from "react-icons/md";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const getGoalSeverityBg = (severity: number): string => {
  switch (severity) {
    case 0:
      return "bg-moneySafe";
    case 1:
      return "bg-moneyWarn";
    case 2:
      return "bg-moneyDanger";
    default:
      return "bg-moneySafe";
  }
};

export default function FinanceGoalDetail() {
  const router = useRouter();
  const dataId = router.query.id;
  const swal = withReactContent(Swal);
  const [historyHeight, setHistoryHeight] = useState("");
  const [goalHistory, setGoalHistory] = useState<GoalSavingHistory[]>([]);
  const [goal, setGoal] = useState<FinanceGoal>({
    id: 0,
    title: "",
    isFlexible: true,
    amount_target: 0,
    amount_reached: 0,
    timebound: new Date(),
    frequencies: 0,
    amount_per_frequency: 0,
    isAchieved: false,
    priority: 0,
    percentage: 0,
    estimated_achieved: new Date(),
    times_to_save_left: 0,
    amounts_to_save_left: 0,
    days_to_go: 0,
    wallet: {
      id: 0,
      icon: "wallet",
      name: "",
    },
    created_at: new Date(),
  });
  const goalInfoRef = useRef<any>();

  const fetchGoal = async () => {
    try {
      const [detailRes, historyRes] = await Promise.all([
        requestAxios({ url: baseUrl + "/finance-goal/" + dataId }),
        requestAxios({ url: baseUrl + "/finance-goal/transaction-history/all/" + dataId }),
      ]);
      setGoal(detailRes.data);
      setGoalHistory(historyRes.data);
    } catch (error) {
      return CustomAlert({ linkToConfirm: UserPath.FINANCE_GOAL, title: String(error) });
    }
  };

  const deleteGoal = async () => {
    //confirmation modal
    swal
      .fire({
        title: "Hapus tujuan keuangan?",
        text: "Data akan terhapus secara permananen",
        icon: "warning",
        ...deleteAlertStyle,
        showCancelButton: true,
        cancelButtonText: "Batal",
        confirmButtonText: "Hapus",
      })
      .then(async (res) => {
        if (res.isConfirmed) {
          await requestAxios({
            url: baseUrl + "/finance-goal/delete/" + dataId,
            method: "DELETE",
          })
            .then((deleteRes) => {
              if (deleteRes.status === 200) {
                swal.fire({ title: "Data berhasil dihapus", icon: "success" }).then((res) => {
                  if (res.isConfirmed) router.push(UserPath.FINANCE_GOAL);
                });
              }
            })
            .catch((error) => {
              CustomAlert({ linkToConfirm: UserPath.FINANCE_GOAL });
            });
        }
      });
  };

  const confirmMarkAsDone = async () => {
    swal
      .fire({
        title: "Tandai tujuan keuangan telah tercapai?",
        icon: "question",
        showCancelButton: true,
        cancelButtonText: "Batal",
        confirmButtonText: "Tandai selesai",
        ...baseAlertStyle,
      })
      .then((res) => {
        if (res.isConfirmed) {
          postMarkAsDone();
        }
      });
  };

  const postMarkAsDone = async () => {
    await requestAxios({
      url: baseUrl + "/finance-goal/mark-achieved/" + dataId,
      method: "PATCH",
    })
      .then((res) => {
        if (res.status === 200) {
          alertSuccesMarkAsDone();
        }
      })
      .catch((error) => {
        return CustomAlert({ linkToConfirm: UserPath.FINANCE_GOAL_DETAIL + dataId });
      });
  };

  const alertSuccesMarkAsDone = async () => {
    swal
      .fire({
        title: "Tujuan keuangan berhasil diselesaikan",
        text: "Tambahkan sebagai pengeluaran?",
        icon: "success",
        showCancelButton: true,
        cancelButtonText: "Tidak",
        confirmButtonText: "Tambahkan",
        ...baseAlertStyle,
      })
      .then((res) => {
        if (res.isConfirmed) {
          router.push({
            pathname: UserPath.TRANSACTION_EXPENSE_ADD,
            query: {
              title: goal.title,
              amount: goal.amount_reached,
            },
          });
        } else {
          router.push(UserPath.FINANCE_GOAL);
        }
      });
  };

  useEffect(() => {
    setHistoryHeight(`max-h-[${goalInfoRef.current.clientHeight}px]`);
  });

  useEffect(() => {
    if (router.isReady) {
      fetchGoal();
    }
  }, [router.isReady]);

  //* COMPONENTS
  const boxStyle = " rounded-md border p-4 ";
  const ProgressBox = () => {
    return (
      <div className={boxStyle}>
        <div className="text-sm md:text-base font-medium text-center" id="goal-progress-bar">
          <div className="flex justify-between mb-1 text-sm">
            <div className="grid grid-rows-2 gap-y-2">
              <span>Tercapai</span>
              <span className=" text-blue font-semibold">
                {currencyFormatter(goal?.amount_reached)}
              </span>
            </div>
            <div className="grid grid-rows-2 gap-y-2">
              <span className="row-start-2 ">{goal?.percentage}%</span>
            </div>
            <div className="grid grid-rows-2 gap-y-2">
              <span>Target</span>
              <span className="text-blue font-semibold">
                {currencyFormatter(goal.amount_target)}
              </span>
            </div>
          </div>
          <ProgressBar bgColor={"bg-blue"} textColor={"text-white"} percentage={goal.percentage} />
        </div>
      </div>
    );
  };

  const EstimationBox = () => {
    return (
      <div className={boxStyle + "flex flex-row gap-2 justify-between"}>
        <div className="flex flex-col">
          <h5 className="text-sm text-gray-600">Perkiraan target tercapai</h5>
          <p className="text-base font-semibold text-blue">
            {goal.estimated_achieved ? moment(goal.estimated_achieved).format("D MMMM YYYY") : "-"}
          </p>
        </div>
        <div className="flex my-auto">
          <p className="text-xs md:text-sm text-palepurple bg-[#f2ebfa] p-1.5 rounded-md">
            {goal.days_to_go} hari lagi
          </p>
        </div>
      </div>
    );
  };

  const SavingBox = () => {
    return (
      <div className={boxStyle + "flex flex-col md:flex-row gap-2 justify-between"}>
        <div className="flex flex-col">
          <h5 className="text-sm text-gray-600">
            Tabungan per {getGoalFrequenceStr(goal.frequencies)}
          </h5>
          <p className="text-base font-semibold text-blue">
            {currencyFormatter(goal.amount_per_frequency)}
          </p>
        </div>
        <div className="flex my-auto">
          <a
            type="button"
            href={
              goal.isAchieved ? "javascript:void(0)" : UserPath.FINANCE_GOAL_ADD_SAVING + dataId
            }
            className={
              (goal.isAchieved
                ? "bg-gray-400 cursor-default focus:ring-0 "
                : "bg-palepurple hover:bg-palepurple cursor-pointer ") +
              "  text-white text-sm " +
              defaultButtonStyle
            }>
            <MdAdd className="text-xl my-auto" />
            Tambah Tabungan
          </a>
        </div>
      </div>
    );
  };

  const GoalEditBox = () => {
    return (
      <div className={boxStyle + "flex flex-col md:flex-row gap-3 justify-between p-3"}>
        <div className="flex flex-col my-auto">
          <h5 className="text-base font-semibold text-gray-600">Ubah Tujuan Keuangan</h5>
          <p className="text-gray-500 text-sm">Atur kembali tujuan keuangan</p>
        </div>
        <div className="flex min-w-[100px]">
          <a
            href={UserPath.FINANCE_GOAL_EDIT + dataId}
            className={
              " bg-palepurple hover:bg-hovpalepurple text-white text-sm " + defaultButtonStyle
            }>
            Ubah
          </a>
          {/* <button
            className={
              " bg-errorRed hover:bg-hovErrorRed text-white text-sm " + defaultButtonStyle
            }>
            Hapus
          </button> */}
        </div>
      </div>
    );
  };

  const GoalDeleteBox = () => {
    return (
      <div className={boxStyle + "flex flex-col md:flex-row gap-3 justify-between p-3"}>
        <div className="flex flex-col my-auto">
          <h5 className="text-base font-semibold text-gray-600">Hapus Tujuan Keuangan</h5>
          <p className="text-gray-500 text-sm">
            Hapus secara permanen tujuan keuangan. Harap yakin
          </p>
        </div>
        <div className="flex min-w-[100px]">
          <button
            onClick={() => deleteGoal()}
            className={
              " bg-errorRed hover:bg-hovErrorRed text-white text-sm  " + defaultButtonStyle
            }>
            Hapus
          </button>
        </div>
      </div>
    );
  };

  const MarkAsDoneBox = () => {
    return (
      <div className={boxStyle + "flex flex-col md:flex-row gap-2 justify-between"}>
        <div className="flex flex-col">
          <h5 className="text-base text-gray-600 font-semibold my-auto">
            Tandai tujuan sebagai tercapai
          </h5>
          <p className="text-gray-500 text-sm lg:max-w-[80%]">
            Tujuan telah selesai dan masukkan kedalam pengeluaran
          </p>
        </div>
        <div className="flex my-auto">
          <button
            disabled={goal.isAchieved}
            onClick={() => confirmMarkAsDone()}
            className={
              (goal.isAchieved ? "bg-gray-400" : "bg-successGreen hover:bg-hovSuccessGreen") +
              "  text-white text-sm gap-1 " +
              defaultButtonStyle
            }>
            <MdCheck className="text-xl my-auto" />
            {goal.isAchieved ? "Tercapai" : "Tandai Tercapai"}
          </button>
        </div>
      </div>
    );
  };

  const HistoryBox = (history: GoalSavingHistory) => {
    return (
      <div className={boxStyle + "flex flex-col justify-between"}>
        <div className="flex justify-between">
          <h5 className="text-sm text-gray-600 my-auto">{history.title}</h5>
          <p className="text-gray-500 text-xs my-auto">
            {moment(history.date).format("D MMMM YYYY")}
          </p>
        </div>
        <div id="left-side">
          <p className="text-sm font-semibold text-blue">{currencyFormatter(history.amount)}</p>
        </div>
      </div>
    );
  };

  return (
    <GoalsLayout backTo={UserPath.FINANCE_GOAL}>
      <section id="goal-detail-header select-none" className="flex flex-col gap-2">
        <h2 className="text-xl font-bold my-auto">{goal.title}</h2>
        <p className="text-base text-gray-600">
          Tabungan {getGoalFrequenceStr(goal.frequencies)}an
        </p>
        <div className="flex flex-row gap-2">
          {goal.isAchieved ? (
            <p
              className={`text-xs text-white my-auto px-2 py-1 rounded-sm max-w-fit min-w-fit bg-successGreen`}>
              Tujuan telah tercapai
            </p>
          ) : (
            ""
          )}
          <p
            className={
              `text-xs text-white my-auto px-2 py-1 rounded-sm max-w-fit min-w-fit ` +
              `${getGoalSeverityBg(goal.priority)}`
            }>
            Prioritas {getGoalSeverityStr(goal.priority)}
          </p>
        </div>
      </section>
      <section
        id="goal-detail-article"
        className="grid grid-cols-1 lg:grid-cols-2 gap-9 select-none ">
        <div className="flex flex-col gap-3" id="goal-info" ref={goalInfoRef}>
          <h3 className="text-lg font-semibold">Informasi Tujuan Keuangan</h3>
          <ProgressBox />
          <EstimationBox />
          <SavingBox />
          <MarkAsDoneBox />
        </div>
        <div className={`flex flex-col gap-2`} id="goal-saving-history">
          <h3 className="text-lg font-semibold">Riwayat Menabung</h3>
          <div className="overflow-auto h-96 flex flex-col gap-2">
            {goalHistory.length ? (
              goalHistory.map((history, index) => (
                <HistoryBox
                  key={index}
                  id={history.id}
                  amount={history.amount}
                  title={history.title}
                  date={history.date}
                  created_at={history.created_at}
                />
              ))
            ) : (
              <Alert text={"Belum ada tabungan. Ayo menabung!"} type={"info"} />
            )}
          </div>
        </div>
      </section>
      <section className="flex flex-col gap-4 select-none">
        <GoalEditBox />
        <GoalDeleteBox />
      </section>
    </GoalsLayout>
  );
}
