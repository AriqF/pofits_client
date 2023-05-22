import AdminLayout from "@/components/layouts/admin/admin-layout";
import { AdminPath } from "@/utils/global/route-path";
import { baseAlertStyle, defaultButtonStyle, deleteAlertStyle } from "@/utils/global/style";
import { CustomAlert } from "@/utils/helper";
import { requestAxios } from "@/utils/helper/axios-helper";
import { baseUrl } from "@/utils/interfaces/constants";
import { User } from "@/utils/interfaces/server-props";
import moment from "moment";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

export default function UserDetail() {
  const router = useRouter();
  const dataId = router.query.id;
  const swal = withReactContent(Swal);
  const [user, setUser] = useState<User>({
    firstname: "",
    lastname: "",
    email: "",
    id: 0,
    status: 1,
    role: "user",
    last_iat: 0,
    created_at: new Date(),
  });

  const fetchUserData = async () => {
    await requestAxios({
      url: baseUrl + "/user/" + dataId,
      method: "GET",
    })
      .then((res) => {
        setUser(res.data);
      })
      .catch((error) => {
        return CustomAlert({ linkToConfirm: AdminPath.USERS, text: String(error) });
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

  const handleDeleteAcc = async () => {
    swal
      .fire({
        title: "Soft Delete Account?",
        icon: "warning",
        ...deleteAlertStyle,
        showCancelButton: true,
        showConfirmButton: true,
        cancelButtonText: "Cancel",
        confirmButtonText: "Delete",
      })
      .then(async (res) => {
        if (res.isConfirmed) {
          await requestAxios({
            url: baseUrl + "/user/soft-delete/" + dataId,
            method: "DELETE",
          })
            .then((res) => {
              if (res.status === 200) {
                swal.fire({ title: "Berhasil dihapus", icon: "success" });
              }
            })
            .catch((error) => {
              CustomAlert({
                linkToConfirm: AdminPath.USER_DETAIL + dataId,
                confirmReload: true,
                text: String(error),
              });
            });
        }
      });
  };

  const handleResetPassword = async () => {
    swal
      .fire({
        title: "Reset password?",
        text: "Password akan dirubah otomatis menjadi default password 'halopofits123'",
        icon: "question",
        ...baseAlertStyle,
        showCancelButton: true,
        showConfirmButton: true,
        cancelButtonText: "Batal",
        confirmButtonText: "Reset",
      })
      .then(async (res) => {
        if (res.isConfirmed) {
          await requestAxios({
            url: baseUrl + "/user/reset-default-password/" + dataId,
            method: "PATCH",
          })
            .then((res) => {
              if (res.status === 200) {
                swal.fire({ title: "Berhasil direset", icon: "success" });
              }
            })
            .catch((error) => {
              CustomAlert({
                linkToConfirm: AdminPath.USER_DETAIL + dataId,
                confirmReload: true,
                text: String(error?.message),
              });
            });
        }
      });
  };

  useEffect(() => {
    if (router.isReady) {
      fetchUserData();
    }
  }, [router.isReady]);

  return (
    <AdminLayout backTo={AdminPath.USERS} title="Detail Pengguna">
      <main className="flex flex-col gap-3">
        <article>
          <ul className="list-none list-outside leading-8">
            <li className="capitalize">
              <span className="font-semibold">Fullname: </span> {user.firstname} {user.lastname}
            </li>
            <li>
              <span className="font-semibold">Email: </span>
              {user.email}{" "}
            </li>
            <li className="capitalize">
              <span className="font-semibold">Role: </span> {user.role}
            </li>
            <li className="capitalize">
              <span className="font-semibold">Status: </span> {getUserStatusStr(user.status)}{" "}
            </li>
            <li className="capitalize">
              <span className="font-semibold">Last Signed In: </span>{" "}
              {moment(user.last_iat * 1000).format("dddd, DD MMMM YYYY")}{" "}
              <span className="text-sm">{`(${moment(user.last_iat * 1000).fromNow()})`}</span>
            </li>
            <li className="capitalize">
              <span className="font-semibold">Created At: </span>{" "}
              {moment(user.created_at).format("dddd, DD MMMM YYYY")}{" "}
              <span className="text-sm">{`(${moment(user.created_at).fromNow()})`}</span>
            </li>
          </ul>
        </article>
        <section className="flex flex-col lg:flex-row gap-3 lg:w-[40%]">
          <button
            onClick={() => handleDeleteAcc()}
            className={defaultButtonStyle + "bg-errorRed hover:bg-hovErrorRed text-white"}>
            Soft Delete Account
          </button>
          <button
            onClick={() => handleResetPassword()}
            className={defaultButtonStyle + "bg-blue hover:bg-hovblue text-white"}>
            Reset Password
          </button>
        </section>
      </main>
    </AdminLayout>
  );
}
