import GoalCard from "@/components/layouts/user/finance-goals/goals-card";
import GoalsLayout from "@/components/layouts/user/finance-goals/goals-layout";
import Alert from "@/components/tools/alerts/alert";
import { UserPath } from "@/utils/global/route-path";
import { defaultButtonStyle } from "@/utils/global/style";
import { CustomAlert } from "@/utils/helper";
import { requestAxios } from "@/utils/helper/axios-helper";
import { baseUrl } from "@/utils/interfaces/constants";
import { FinanceGoal } from "@/utils/interfaces/server-props";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function FinanceGoalIndex() {
  const [goals, setGoals] = useState<FinanceGoal[]>([]);

  const router = useRouter();

  const fetchGoals = async () => {
    await requestAxios({
      url: baseUrl + "/finance-goal/all",
      method: "GET",
    })
      .then((res) => {
        setGoals(res.data);
      })
      .catch((error) => {
        return CustomAlert({ linkToConfirm: UserPath.HOME });
      });
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchGoals();
    }, 500);

    return () => clearTimeout(timer);
  });

  return (
    <GoalsLayout backTo={UserPath.HOME}>
      <section
        id="goal-header"
        className="flex flex-col md:flex-row md:justify-between gap-y-3 mb-5 select-none">
        <h2 className="text-2xl text-gray-600 my-auto">Rencana Keuanganmu</h2>
        <div className="flex md:ml-auto my-auto md:w-[15%]">
          <a
            href={UserPath.FINANCE_GOAL_ADD}
            className={
              "bg-palepurple hover:bg-hovpalepurple text-white text-base font-normal " +
              defaultButtonStyle
            }>
            Tambah Rencana
          </a>
        </div>
      </section>
      <section id="goals-card" className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {goals.length > 0 ? (
          goals.map((goal, index) => (
            <GoalCard
              key={index}
              dataId={goal.id}
              title={goal.title}
              timebound={goal.timebound}
              severity={goal.priority}
              amountTarget={goal.amount_target}
              amountReached={goal.amount_reached}
              percentage={goal.percentage}
              isAchieved={goal.isAchieved}
            />
          ))
        ) : (
          <Alert
            text={"Belum ada tujuan keuangan"}
            type={"info"}
            className="py-3.5 text-sm lg:col-span-3 m-auto w-full md:w-[30%]"
          />
        )}
        {}
      </section>
    </GoalsLayout>
  );
}
