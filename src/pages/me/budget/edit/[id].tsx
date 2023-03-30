import BudgetPageLayout from "@/components/layouts/user/budget/budget-layout";
import Container from "@/components/tools/container";
import InputForm from "@/components/tools/form/input-form";
import { UserPath } from "@/utils/global/route-path";
import { formStyle, selectFormStyle } from "@/utils/global/style";
import { CustomAlert, numFormatter } from "@/utils/helper";
import { requestAxios } from "@/utils/helper/axios-helper";
import { baseUrl } from "@/utils/interfaces/constants";
import { BudgetData } from "@/utils/interfaces/server-props";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import ReactSelect from "react-select";
import Image from "next/image";
import DefaultButton from "@/components/tools/button";
import Alert from "@/components/tools/alerts/alert";
import moment from "moment";

export default function EditBudgetAllocation() {
  const [budgetDate, setBudgetDate] = useState(new Date());
  const router = useRouter();
  const dataId = router.query.id;
  const ref = useRef<any>();

  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors, isSubmitting },
  } = useForm<BudgetData>();

  const getData = async () => {
    await requestAxios({
      url: baseUrl + "/budget/" + dataId,
      method: "GET",
    })
      .then((res) => {
        setValue("category", res.data.category);
        setValue("amount", res.data.amount);
        setBudgetDate(res.data.start_date);
      })
      .catch((err) => {
        return CustomAlert({ linkToConfirm: "/me/settings/expense-category" });
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
            <h3 className="text-2xl font-semibold">Edit Alokasi Anggaran</h3>
            <hr className="border-b border-2 border-gray-300 w-full md:w-6/12" />
            <Alert
              text={`Anggaran Bulan ${moment(budgetDate).format("MMMM YYYY")}`}
              type="info"
              className="w-full md:w-[40%] opacity-90"
            />
          </div>
          <form id="edit-budget-form">
            <div className="flex flex-col gap-y-5 w-full">
              <InputForm label="Kategori" id="category-select" errors={errors.category?.message}>
                <Controller
                  {...register("category", { required: "Kategori perlu diisi" })}
                  control={control}
                  render={({ field }) => {
                    return (
                      <ReactSelect
                        styles={{
                          control: (baseStyles, state) => ({
                            // ...baseStyles,
                            borderColor: errors.category
                              ? "border-errorRed"
                              : "focus:border-errorRed",
                          }),
                        }}
                        classNames={{
                          control: (state) =>
                            selectFormStyle +
                            (errors.category ? " border-errorRed focus:border-errorRed" : ""),
                        }}
                        placeholder="Pilih kategori"
                        className={errors.category ? "border-errorRed focus:border-errorRed" : ""}
                        value={field.value}
                        isDisabled
                        onChange={field.onChange}
                        formatOptionLabel={(item) => (
                          <div className="inline-flex space-x-3 my-auto">
                            <Image
                              src={`/assets/icons/svg/${item.icon}.svg`}
                              alt="category-icon"
                              width={30}
                              height={30}
                              className="my-auto"
                            />
                            <p className="my-auto">{item.title}</p>
                          </div>
                        )}
                      />
                    );
                  }}
                />
              </InputForm>
              <InputForm label="Berapa anggaran kamu" id="amount" errors={errors.amount?.message}>
                <div className="flex">
                  <span className="inline-flex items-center px-3 text-sm text-gray-900 bg-gray-200 border border-r-0 border-gray-300 rounded-l-md ">
                    Rp
                  </span>
                  <input
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
