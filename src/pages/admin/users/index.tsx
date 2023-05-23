import AdminLayout from "@/components/layouts/admin/admin-layout";
import Alert from "@/components/tools/alerts/alert";
import { AdminPath } from "@/utils/global/route-path";
import { CustomAlert } from "@/utils/helper";
import { requestAxios } from "@/utils/helper/axios-helper";
import { baseUrl } from "@/utils/interfaces/constants";
import { User } from "@/utils/interfaces/server-props";
import moment from "moment";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { MdInfo, MdSearch } from "react-icons/md";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

interface SearchForm {
  search: string;
}

export default function UserListPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [search, setSearch] = useState("");
  const swal = withReactContent(Swal);
  const router = useRouter();

  const fetchUsers = async () => {
    await requestAxios({
      url: baseUrl + "/user/all" + `?search=${search}`,
      method: "GET",
    })
      .then((res) => {
        setUsers(res.data);
      })
      .catch((error) => {
        return CustomAlert({ linkToConfirm: AdminPath.HOME, text: String(error) });
      });
  };

  const getUserStatusStr = (status: number) => {
    switch (status) {
      case 0:
        return "Deleted Account";
      case 1:
        return "Active";
      default:
        return "Inactive";
    }
  };

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<SearchForm>();

  const onSubmit: SubmitHandler<SearchForm> = async (data: SearchForm) => {
    setSearch(data.search);
  };

  useEffect(() => {
    fetchUsers();
  }, [search]);

  const DataTable = () => {
    return (
      <div className="relative overflow-x-auto xl:max-w-screen-xl">
        <table className="w-full text-sm text-left text-gray-500 ">
          <thead className="text-xs text-gray-700 uppercase bg-gray-200  ">
            <tr>
              <th scope="col" className="px-6 py-3">
                Email
              </th>
              <th scope="col" className="px-6 py-3">
                First Name
              </th>
              <th scope="col" className="px-6 py-3">
                Last Name
              </th>
              <th scope="col" className="px-6 py-3">
                Last Signed In
              </th>
              <th scope="col" className="px-6 py-3">
                Status
              </th>
              <th scope="col" className="px-6 py-3">
                Created At
              </th>
              <th scope="col" className="px-6 py-3">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {users.length > 0 ? (
              users.map((user, index) => (
                <tr key={index} className="bg-white border-b ">
                  <th
                    scope="row"
                    className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap ">
                    {user.email}
                  </th>
                  <td className="px-6 py-4">{user.firstname}</td>
                  <td className="px-6 py-4">{user.lastname}</td>
                  <td className="px-6 py-4">
                    {moment(user.last_iat * 1000).format("DD MMMM YYYY hh:mm:ss")}
                  </td>
                  <td className="px-6 py-4 capitalize">{getUserStatusStr(user.status)}</td>

                  <td className="px-6 py-4 capitalize">
                    {moment(user.created_at).format("DD MMMM YYYY hh:mm:ss")} <br />
                    <span className="text-xs">{moment(user.created_at).fromNow()}</span>
                  </td>
                  <td className={"px-6 py-4 flex"}>
                    <a href={AdminPath.USER_DETAIL + user.id} className="mx-auto">
                      <MdInfo className="text-2xl text-blue hover:text-hovblue" />
                    </a>
                  </td>
                </tr>
              ))
            ) : (
              <tr className="bg-white border-b">
                <th
                  scope="row"
                  colSpan={100}
                  className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap ">
                  <Alert text={"Belum ada pengguna"} className="flex" type={"info"} />
                </th>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    );
  };

  const SearchBar = () => {
    return (
      <form className="inline-flex w-full" onSubmit={handleSubmit(onSubmit)}>
        <input
          {...register("search")}
          className="cursor-pointer inline-flex items-center py-2.5 text-sm font-medium text-gray-900 bg-gray-100 border border-gray-300 rounded-l-md hover:bg-gray-200"
          type="text"
          placeholder="Cari nama atau email"
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
    <AdminLayout backTo={AdminPath.HOME} title="Daftar Pengguna">
      <main className="flex flex-col gap-3">
        <SearchBar />
        <DataTable />
      </main>
    </AdminLayout>
  );
}
