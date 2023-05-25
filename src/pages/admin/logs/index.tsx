import AdminLayout from "@/components/layouts/admin/admin-layout";
import Alert from "@/components/tools/alerts/alert";
import { AdminPath } from "@/utils/global/route-path";
import { baseAlertStyle } from "@/utils/global/style";
import { CustomAlert } from "@/utils/helper";
import { requestAxios } from "@/utils/helper/axios-helper";
import { baseUrl } from "@/utils/interfaces/constants";
import { Weblogs } from "@/utils/interfaces/server-props";
import moment from "moment";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { MdChevronLeft, MdChevronRight, MdSearch } from "react-icons/md";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

interface SearchForm {
  search: string;
}

export default function AdminLog() {
  const [logs, setLogs] = useState<Weblogs[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [take, setTake] = useState(6);
  const swal = withReactContent(Swal);
  const router = useRouter();

  const handlePreviousPage = () => {
    if (currentPage === 1) {
      swal.fire({
        title: "Ini sudah halaman pertama",
        icon: "warning",
        ...baseAlertStyle,
      });
      return;
    }
    setCurrentPage(currentPage - 1);
  };

  const handleNextPage = () => {
    setCurrentPage(currentPage + 1);
  };

  const handleSetPage = (page: number) => {
    if (page < 1) {
      swal.fire({
        title: "Halaman tidak ditemukan",
        icon: "error",
        ...baseAlertStyle,
      });
    }
    setCurrentPage(page);
  };

  const fetchLog = async () => {
    await requestAxios({
      url: baseUrl + "/weblog" + `?take=${take}&page=${currentPage}&search=${searchQuery}`,
      method: "GET",
    })
      .then((res) => {
        setLogs(res.data);
      })
      .catch((error) => {
        alert(error);
        return CustomAlert({ linkToConfirm: AdminPath.HOME, confirmReload: true });
      });
  };

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<SearchForm>();

  const onSubmit: SubmitHandler<SearchForm> = async (data: SearchForm) => {
    setCurrentPage(1);
    setSearchQuery(data.search);
  };

  useEffect(() => {
    fetchLog();
  }, [currentPage, searchQuery]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchLog();
    }, 4500);

    return () => clearTimeout(timer);
  });

  const DataTable = () => {
    return (
      <div className="relative overflow-x-auto xl:max-w-screen-xl">
        <table className="w-full text-sm text-left text-gray-500 ">
          <thead className="text-xs text-gray-700 uppercase bg-gray-200  ">
            <tr>
              <th scope="col" className="px-6 py-3">
                User Email
              </th>
              {/* <th scope="col" className="px-6 py-3">
                User Full Name
              </th> */}
              <th scope="col" className="px-6 py-3">
                Activity
              </th>
              <th scope="col" className="px-6 py-3">
                Created At
              </th>
              <th scope="col" className="px-6 py-3">
                Module
              </th>
              <th scope="col" className="px-6 py-3">
                IP Address
              </th>
              <th scope="col" className="px-6 py-3">
                Type
              </th>
            </tr>
          </thead>
          <tbody>
            {logs.length > 0 ? (
              logs.map((log, index) => (
                <tr
                  key={index}
                  className={
                    "border-b " + (log.type === "failure" ? "bg-errorRed text-white" : "")
                  }>
                  <th key={index} scope="row" className="px-6 py-4 whitespace-nowrap ">
                    {log.user_email ? log.user_email : "-"}
                  </th>
                  {/* <td className="px-6 py-4">
                    {log.created_by?.firstname} {log.created_by?.lastname}{" "}
                  </td> */}
                  <td key={index} className="px-6 py-4 text-ellipsis overflow-hidden">
                    {log.log}
                  </td>
                  <td key={index} className="px-6 py-4 capitalize">
                    {moment(log.created_at).format("DD MMMM YYYY hh:mm:ss")}
                  </td>
                  <td key={index} className="px-6 py-4 capitalize">
                    {log.module}
                  </td>

                  <td key={index} className="px-6 py-4">
                    {log.ip_address}
                  </td>
                  <td key={index} className={"px-6 py-4 capitalize"}>
                    {/* <span
                      className={
                        (log.type === "info"
                          ? "bg-infoBlue text-white"
                          : "bg-errorRed text-white") + " px-3 py-2 rounded-md"
                      }>
                    </span> */}
                    {log.type}
                  </td>
                </tr>
              ))
            ) : (
              <tr className="bg-white border-b">
                <th
                  scope="row"
                  colSpan={100}
                  className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap ">
                  <Alert text={"Belum ada log"} className="flex" type={"info"} />
                </th>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    );
  };

  const PageInfo = () => {
    return (
      <span className="text-sm font-normal text-gray-500 ">
        Menampilkan halaman <span className="font-semibold text-gray-900 ">{currentPage}</span>
      </span>
    );
  };

  const TablePagination = () => {
    return (
      <nav
        className="flex flex-col lg:flex-row gap-3 items-center justify-between lg:order-last"
        aria-label="Table navigation">
        <ul className="inline-flex items-center -space-x-px">
          <li>
            <button
              onClick={() => handlePreviousPage()}
              className="block px-3 py-2 ml-0 leading-tight text-gray-500 bg-white border border-gray-300 rounded-l-lg hover:bg-gray-100 hover:text-gray-700 ">
              <span className="sr-only">Previous</span>
              <MdChevronLeft className="text-xl" />
            </button>
          </li>
          <li>
            <button
              onClick={() => handleSetPage(currentPage - 2 >= 1 ? currentPage - 2 : 1)}
              className="px-3 py-2 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 ">
              {currentPage - 2 >= 1 ? currentPage - 2 : 1}
            </button>
          </li>
          <li>
            <button
              onClick={() => handleSetPage(currentPage - 1 >= 2 ? currentPage - 1 : 2)}
              className="px-3 py-2 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 ">
              {currentPage - 1 >= 2 ? currentPage - 1 : 2}
            </button>
          </li>
          {/* <li>
            <a
              href="#"
              aria-current="page"
              className="z-10 px-3 py-2 leading-tight text-blue-600 border border-blue-300 bg-blue-50 hover:bg-blue-100 hover:text-blue-700 ">
              {currentPage}
            </a>
          </li> */}
          <li>
            <Link
              href="#"
              className="px-3 py-2 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 ">
              ...
            </Link>
          </li>
          <li>
            <button
              onClick={() => handleSetPage(currentPage + 2)}
              className="px-3 py-2 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 ">
              {currentPage + 2}
            </button>
          </li>
          <li>
            <button
              onClick={() => handleNextPage()}
              className="block px-3 py-2 leading-tight text-gray-500 bg-white border border-gray-300 rounded-r-lg hover:bg-gray-100 hover:text-gray-700 ">
              <span className="sr-only">Next</span>
              <MdChevronRight className="text-xl" />
            </button>
          </li>
        </ul>
      </nav>
    );
  };

  const SearchBar = () => {
    return (
      <form className="inline-flex w-full lg:w-[50%] order-last" onSubmit={handleSubmit(onSubmit)}>
        <input
          {...register("search")}
          className="w-full cursor-pointer inline-flex items-center py-2.5 text-sm font-medium text-gray-900 bg-gray-100 border border-gray-300 rounded-l-md hover:bg-gray-200"
          type="text"
          placeholder="Cari aktifitas atau dengan nama atau email pengguna"
        />
        <button
          type="submit"
          className="p-2.5 text-sm font-medium text-white bg-blue rounded-r-md border border-blue hover:bg-hovblue">
          <MdSearch className="text-xl" />
          <span className="sr-only">Search</span>
        </button>
      </form>
    );
  };

  return (
    <AdminLayout backTo={AdminPath.HOME} title="Web Log">
      <main className="flex flex-col gap-3">
        <section className="flex flex-col gap-2">
          <PageInfo />
          <div className="flex flex-col lg:flex-row justify-between gap-2">
            <SearchBar />
            <TablePagination />
          </div>
        </section>
        <section>
          <DataTable />
        </section>
      </main>
    </AdminLayout>
  );
}
