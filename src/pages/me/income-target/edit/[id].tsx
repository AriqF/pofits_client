import BudgetPageLayout from "@/components/layouts/user/budget/budget-layout";
import Alert from "@/components/tools/alerts/alert";
import DefaultButton from "@/components/tools/button";
import Container from "@/components/tools/container";
import InputForm from "@/components/tools/form/input-form";
import { UserPath } from "@/utils/global/route-path";
import { baseAlertStyle, currencyFormStyle, selectFormStyle } from "@/utils/global/style";
import { CustomAlert, numFormatter } from "@/utils/helper";
import { requestAxios } from "@/utils/helper/axios-helper";
import { baseUrl } from "@/utils/interfaces/constants";
import { IncomeEstmationForm } from "@/utils/interfaces/server-props";
import moment from "moment";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import ReactSelect from "react-select";
import Image from "next/image";
import withReactContent from "sweetalert2-react-content";
import Swal from "sweetalert2";

export default function EditTargetAmount() {
  const [targetDate, setTargetDate] = useState(new Date());
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
  } = useForm<IncomeEstmationForm>();

  const onSubmit: SubmitHandler<IncomeEstmationForm> = async (data: IncomeEstmationForm) => {
    await requestAxios({
      url: baseUrl + "/income-estimation/edit/" + dataId,
      method: "PATCH",
      data: {
        amount: parseInt(data.amount.replace(/\./g, "")),
      },
    }).then((res) => {
      swal
        .fire({
          title: `Target ${category} berhasil dirubah`,
          icon: "success",
          ...baseAlertStyle,
        })
        .then((res) => {
          if (res.isConfirmed) router.push(UserPath.ESTIMATION);
        });
    });
  };

  const getData = async () => {
    await requestAxios({
      url: baseUrl + "/income-estimation/" + dataId,
      method: "GET",
    })
      .then((res) => {
        setValue("amount", res.data.amount);
        setTargetDate(res.data.start_date);
        setCategory(res.data.category.title);
        setIcon(res.data.category.icon);
      })
      .catch((err) => {
        return CustomAlert({ linkToConfirm: UserPath.ESTIMATION });
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
                <h3 className="text-xl font-semibold">Edit Target {category}</h3>
                <h5 className="text-base text-mute capitalize">
                  {moment(targetDate).format("MMMM YYYY")}
                </h5>
              </div>
            </div>
          </div>
          <form id="edit-budget-form" onSubmit={handleSubmit(onSubmit)}>
            <div className="flex flex-col gap-y-5 w-full md:w-[75%]">
              <InputForm label="Berapa target kamu" id="amount" errors={errors.amount?.message}>
                <div className="flex">
                  <span className="inline-flex items-center px-3 text-sm text-gray-900 bg-gray-200 border border-r-0 border-gray-300 rounded-l-md ">
                    Rp
                  </span>
                  <input
                    type="text"
                    id="amount"
                    className={
                      currencyFormStyle +
                      (errors.amount ? "border-errorRed focus:border-errorRed" : "")
                    }
                    placeholder="Nominal target"
                    {...register("amount", {
                      required: "Nilai target perlu diisi",
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
                type={"submit"}
                text={"Simpan"}
                // icon={MdAdd}
                color={"default"}
                className="text-center flex place-content-center md:w-[30%]"
              />
            </div>
          </form>
        </Container>
      </section>
    </BudgetPageLayout>
  );
}
