import TransactionLayout from "@/components/layouts/user/transaction/transaction-layout";
import Container from "@/components/tools/container";
import { UserPath } from "@/utils/global/route-path";
import { useEffect, useState } from "react";
import Image from "next/image";
import InputForm from "@/components/tools/form/input-form";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import ReactSelect from "react-select";
import {
  baseAlertStyle,
  baseFormStyle,
  currencyFormStyle,
  selectFormStyle,
} from "@/utils/global/style";
import { CustomAlert, getNumOnlyFromStr, numFormatter } from "@/utils/helper";
import DefaultButton from "@/components/tools/button";
import { ExpenseCategory, ExpenseForm, WalletData } from "@/utils/interfaces/server-props";
import withReactContent from "sweetalert2-react-content";
import Swal from "sweetalert2";
import { useRouter } from "next/router";
import { requestAxios } from "@/utils/helper/axios-helper";
import { baseUrl } from "@/utils/interfaces/constants";
import moment from "moment";

export default function AddExpensePage() {
  const [categoriesOpt, setCategoriesOpt] = useState([]);
  const [walletsOpt, setWalletsOpt] = useState([]);
  const swal = withReactContent(Swal);
  const router = useRouter();

  const getUserData = async () => {
    try {
      const [categoryRes, walletRes] = await Promise.all([
        requestAxios({ url: baseUrl + "/expense-category/me", method: "GET" }),
        requestAxios({ url: baseUrl + "/wallet/me", method: "GET" }),
      ]);
      const categories: any = categoryRes.data.map((item: ExpenseCategory) => {
        return {
          value: item.id,
          label: item.title,
          icon: item.icon,
        };
      });
      const wallets: any = walletRes.data.map((item: WalletData) => {
        return {
          value: item.id,
          label: item.name,
          icon: item.icon,
        };
      });
      setCategoriesOpt(categories);
      setWalletsOpt(wallets);
    } catch (error) {
      return CustomAlert({ linkToConfirm: UserPath.TRANSACTION });
    }
  };

  const submitHandler: SubmitHandler<ExpenseForm> = async (data: ExpenseForm) => {
    await requestAxios({
      url: baseUrl + "/transaction/expense/add",
      method: "POST",
      data: {
        category: data.category.value,
        amount: getNumOnlyFromStr(data.amount),
        title: data.title,
        date: data.date,
        wallet: data.wallet?.value,
        description: data.description,
      },
    }).then((res) => {
      if (res.status === 201) {
        return swal
          .fire({
            icon: "success",
            title: "Transaksi berhasil ditambahkan",
            text: "Tambahkan transaksi lain?",
            ...baseAlertStyle,
            showCancelButton: true,
            cancelButtonText: "Tidak",
            confirmButtonText: "Tambah lagi",
          })
          .then((res) => {
            if (res.isConfirmed) router.reload();
            return router.push(UserPath.TRANSACTION);
          });
      }
    });
  };

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    control,
    formState: { errors, isSubmitting },
  } = useForm<ExpenseForm>({
    defaultValues: {
      date: moment(new Date()).format("YYYY-MM-DD"),
    },
  });

  useEffect(() => {
    getUserData();
  }, []);

  useEffect(() => {
    if (router.isReady) {
      console.log({ ...router.query });
      setValue("title", router.query.title as string);
      setValue("amount", router.query.amount as string);
    }
  }, [router.isReady]);

  return (
    <TransactionLayout backTo={UserPath.TRANSACTION}>
      <section className="col-span-4 flex flex-col">
        <Container className="w-full p-1 md:p-6 flex flex-col gap-y-3">
          <h3 className="text-2xl font-semibold select-none">Tambah Pengeluaran</h3>
          <form onSubmit={handleSubmit(submitHandler)}>
            <div id="add-exp-transaction" className="flex flex-col gap-y-5 w-full">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                <InputForm label="Nominal" id="amount" errors={errors.amount?.message}>
                  <div className="flex">
                    <span className="inline-flex items-center px-3 text-sm text-gray-900 bg-gray-200 border border-r-0 border-gray-300 rounded-l-md ">
                      Rp
                    </span>
                    <input
                      onFocus={(e) => e.target.select()}
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
                <InputForm
                  label="Judul Transaksi"
                  id="transaction-title"
                  errors={errors.title?.message}>
                  <input
                    type="text"
                    id="transaction-title"
                    placeholder="Deskripsi singkat transaksi"
                    className={
                      baseFormStyle + (errors.title ? "border-errorRed focus:border-errorRed" : "")
                    }
                    {...register("title", {
                      required: "Nama transaksi perlu diisi",
                      maxLength: {
                        value: 30,
                        message: "Judul transaksi maksimal 30 karakter",
                      },
                    })}
                  />
                </InputForm>
                <InputForm label={"Tanggal"} id="date" errors={errors.date?.message}>
                  <input
                    {...register("date", { required: "Tanggal transaksi perlu diisi" })}
                    type="date"
                    id="date"
                    className={
                      baseFormStyle + (errors.date ? "border-errorRed focus:border-errorRed" : "")
                    }
                  />
                </InputForm>
                <InputForm label="Kategori" id="category-select>" errors={errors.category?.message}>
                  <Controller
                    control={control}
                    {...register("category", { required: "Kategori perlu dipilih" })}
                    render={({ field }) => {
                      return (
                        <ReactSelect
                          classNames={{
                            control: (state) => selectFormStyle,
                            // (errors.category ? " border-errorRed focus:border-errorRed" : ""),
                          }}
                          placeholder="Pilih kategori"
                          value={field.value}
                          options={categoriesOpt}
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
                <InputForm
                  label="Sumber Dana (Opsional)"
                  id="wallet-select>"
                  errors={errors.wallet?.message}>
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
                          options={walletsOpt}
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
              <InputForm
                label="Deskripsi (Opsional)"
                id={"description"}
                errors={errors.description?.message}>
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
                  "w-full lg:w-[20%]"
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
