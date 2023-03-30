import BudgetPageLayout from "@/components/layouts/user/budget/budget-layout";
import { UserPath } from "@/utils/global/route-path";
import AddBudgetForm from "../../../../components/layouts/user/budget/add-form";

export default function AddBudgetPage() {
  return (
    <BudgetPageLayout backTo={UserPath.BUDGET}>
      {/* <section className="flex flex-col col-span-1" id="add-budget-helper">
        <AddBudgetHelper />
      </section> */}
      <section className="flex flex-col col-span-2">
        <AddBudgetForm />
      </section>
    </BudgetPageLayout>
  );
}
