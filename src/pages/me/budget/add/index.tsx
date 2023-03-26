import BudgetPageLayout from "@/components/layouts/user/budget/budget-layout";
import DefaultButton from "@/components/tools/button";
import Container from "@/components/tools/container";
import InputForm from "@/components/tools/form/input-form";
import { UserPath } from "@/utils/global/route-path";
import { baseFormStyle } from "@/utils/global/style";
import { numFormatter } from "@/utils/helper";
import { BudgetData } from "@/utils/interfaces/server-props";
import { useRouter } from "next/router";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from "react-icons/md";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import DatePicker from "tailwind-datepicker-react";
import AddBudgetForm from "./add-form";
import AddBudgetHelper from "./add-helper";

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
