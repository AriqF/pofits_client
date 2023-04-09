import TransactionLayout from "@/components/layouts/user/transaction/transaction-layout";
import Container from "@/components/tools/container";
import { UserPath } from "@/utils/global/route-path";
import { useState } from "react";
import Image from "next/image";
import InputForm from "@/components/tools/form/input-form";
import { Controller, useForm } from "react-hook-form";
import ReactSelect from "react-select";
import { baseFormStyle, currencyFormStyle, selectFormStyle } from "@/utils/global/style";
import { numFormatter } from "@/utils/helper";

export default function EditExpenseDataPage() {
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    control,
    formState: { errors, isSubmitting },
  } = useForm<any>();

  return (
    <TransactionLayout backTo={UserPath.TRANSACTION}>
      <section className="col-span-4 flex flex-col">
        <Container className="w-full p-1 md:p-6 flex flex-col gap-y-3">
          <h3 className="text-2xl font-semibold select-none">Edit Pengeluaran</h3>
          <form>
            <div id="add-exp-transaction" className="flex flex-col gap-y-5 w-full">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <InputForm label="Nominal" id="amount" errors={""}>
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
                      placeholder="Nominal"
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
                <InputForm label="Judul Transaksi" id="transaction-title" errors={""}>
                  <input
                    type="text"
                    id="transaction-title"
                    placeholder="Deskripsi singkat transaksi"
                    className={
                      baseFormStyle + (errors.name ? "border-errorRed focus:border-errorRed" : "")
                    }
                    {...register("name", {
                      required: "Nama transaksi perlu diisi",
                      maxLength: {
                        value: 50,
                        message: "Judul transaksi maksimal 50 karakter",
                      },
                    })}
                  />
                </InputForm>
                <InputForm label={"Tanggal"} id="date" errors={""}>
                  <input
                    {...register("date", { required: "Tanggal transaksi perlu diisi" })}
                    type="date"
                    id="start_date"
                    className={
                      baseFormStyle +
                      (errors.start_date ? "border-errorRed focus:border-errorRed" : "")
                    }
                  />
                </InputForm>
                <InputForm label="Kategori" id="category-select>" errors={""}>
                  <Controller
                    name="category"
                    control={control}
                    render={({ field }) => {
                      return (
                        <ReactSelect
                          classNames={{
                            control: (state) => selectFormStyle,
                            // (errors.category ? " border-errorRed focus:border-errorRed" : ""),
                          }}
                          placeholder="Pilih kategori"
                          value={field.value}
                          options={[]}
                          onChange={field.onChange}
                          formatOptionLabel={(item) => (
                            <div className="inline-flex space-x-3 my-auto">
                              <Image
                                src={`/assets/icons/svg/${item.icon}.svg`}
                                alt="category-icon"
                                width={25}
                                height={25}
                                className="my-auto"
                              />
                              <p className="my-auto">{item.label}</p>
                            </div>
                          )}
                        />
                      );
                    }}
                  />
                </InputForm>
                <InputForm label="Sumber Dana (Opsional)" id="wallet-select>" errors={""}>
                  <Controller
                    name="wallet"
                    control={control}
                    render={({ field }) => {
                      return (
                        <ReactSelect
                          classNames={{
                            control: (state) => selectFormStyle,
                            // (errors.category ? " border-errorRed focus:border-errorRed" : ""),
                          }}
                          placeholder="Pilih Dompet"
                          value={field.value}
                          options={[]}
                          onChange={field.onChange}
                          formatOptionLabel={(item) => (
                            <div className="inline-flex space-x-3 my-auto">
                              <Image
                                src={`/assets/icons/svg/${item.icon}.svg`}
                                alt="category-icon"
                                width={25}
                                height={25}
                                className="my-auto"
                              />
                              <p className="my-auto">{item.label}</p>
                            </div>
                          )}
                        />
                      );
                    }}
                  />
                </InputForm>
              </div>
              <InputForm label="Deskripsi (Opsional)" id={"description"} errors={""}>
                <textarea
                  rows={3}
                  id="description"
                  placeholder="Deskripsi transaksi"
                  maxLength={255}
                  className={
                    baseFormStyle +
                    (errors.description ? "border-errorRed focus:border-errorRed" : "")
                  }
                  {...register("description", {
                    maxLength: {
                      value: 255,
                      message: "Deskripsi maksimal 255 karakter",
                    },
                  })}
                />
              </InputForm>
              <button
                className={
                  "col-span-2 " +
                  "border bg-palepurple text-white hover:bg-hovpalepurple " +
                  "inline-flex place-content-center text-center font-semibold focus:ring-1 focus:outline-none " +
                  "rounded-md text-md px-4 py-3 w-full m-auto transition-colors duration-200 " +
                  "w-full md:w-[20%]"
                }>
                Simpan
              </button>
            </div>
          </form>
        </Container>
      </section>
    </TransactionLayout>
  );
}
