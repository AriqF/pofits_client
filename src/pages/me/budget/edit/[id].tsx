import BudgetPageLayout from "@/components/layouts/user/budget/budget-layout";
import Container from "@/components/tools/container";
import InputForm from "@/components/tools/form/input-form";
import { UserPath } from "@/utils/global/route-path";
import { baseAlertStyle, formStyle, selectFormStyle } from "@/utils/global/style";
import { CustomAlert, numFormatter } from "@/utils/helper";
import { requestAxios } from "@/utils/helper/axios-helper";
import { baseUrl } from "@/utils/interfaces/constants";
import { AddBudgetData, BudgetData } from "@/utils/interfaces/server-props";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import ReactSelect from "react-select";
import Image from "next/image";
import DefaultButton from "@/components/tools/button";
import Alert from "@/components/tools/alerts/alert";
import moment from "moment";
import withReactContent from "sweetalert2-react-content";
import Swal from "sweetalert2";

export default function EditBudgetAllocation() {
  const [budgetDate, setBudgetDate] = useState(new Date());
  const [category, setCategory] = useState("");
  const [icon, setIcon] = useState("");
  const router = useRouter();
  const dataId = router.query.id;
  const ref = useRef<any>();
  const swal = withReactContent(Swal);

  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors, isSubmitting },
  } = useForm<AddBudgetData>();

  const onSubmit: SubmitHandler<AddBudgetData> = async (data: AddBudgetData) => {
    await requestAxios({
      url: baseUrl + "/budget/edit/" + dataId,
      method: "PATCH",
      data: {
        amount: parseInt(data.amount.replace(/\./g, "")),
      },
    }).then((res) => {
      swal
        .fire({
          title: `Anggaran ${category} berhasil dirubah`,
          icon: "success",
          ...baseAlertStyle,
        })
        .then((res) => {
          if (res.isConfirmed) router.push(UserPath.BUDGET);
        });
    });
  };

  const getData = async () => {
    await requestAxios({
      url: baseUrl + "/budget/" + dataId,
      method: "GET",
    })
      .then((res) => {
        setValue("amount", res.data.amount);
        setBudgetDate(res.data.start_date);
        setCategory(res.data.category.title);
        setIcon(res.data.category.icon);
      })
      .catch((err) => {
        return CustomAlert({ linkToConfirm: UserPath.BUDGET });
      });
  };

  useEffect(() => {
    if (router.isReady) {
      getData();
    }
  }, [router.isReady]);

  return (
    <BudgetPageLayout backTo={UserPath.BUDGET}>
      <section className="flex flex-col col-span-2">
        <Container className="w-full p-1 md:p-6">
          <div className="mb-3 space-y-4">
            <div className="inline-flex gap-4">
              <div className="rounded-full p-2 bg-gray-300 my-auto">
                <Image
                  src={`/assets/icons/svg/${icon}.svg`}
                  alt="category-icon"
                  width={50}
                  height={50}
                  className="my-auto"
                />
              </div>
              <div className="my-auto">
                <h3 className="text-xl font-semibold">Edit Alokasi Anggaran {category}</h3>
                <h5 className="text-base text-mute capitalize">
                  {moment(budgetDate).format("MMMM YYYY")}
                </h5>
              </div>
            </div>
          </div>
          <form id="edit-budget-form" onSubmit={handleSubmit(onSubmit)}>
            <div className="flex flex-col gap-y-5 w-full lg:w-[75%]">
              <InputForm label="Berapa anggaran kamu" id="amount" errors={errors.amount?.message}>
                <div className="flex">
                  <span className="inline-flex items-center px-3 text-sm text-gray-900 bg-gray-200 border border-r-0 border-gray-300 rounded-l-md ">
                    Rp
                  </span>
                  <input
                    onFocus={(e) => e.target.select()}
                    type="text"
                    id="amount"
                    className={
                      "rounded-r-md " +
                      formStyle +
                      (errors.amount ? "border-errorRed focus:border-errorRed" : "")
                    }
                    placeholder="Nominal anggaran"
                    {...register("amount", {
                      required: "Nilai anggaran perlu diisi",
                      pattern: {
                        value: /^\d+(\.\d+)*$/,
                        message: "Input hanya diperbolehkan angka",
                      },
                      onChange: (e) => {
                        e.target.value = e.target.value.replace(/\./g, "");
                        setValue("amount", numFormatter(e.target.value));
                      },
                    })}
                  />
                </div>
              </InputForm>
              <DefaultButton
                isSubmitting={isSubmitting}
                type={"submit"}
                color={"default"}
                className="text-center flex place-content-center lg:w-[30%]">
                Simpan
              </DefaultButton>
            </div>
          </form>
        </Container>
      </section>
    </BudgetPageLayout>
  );
}
