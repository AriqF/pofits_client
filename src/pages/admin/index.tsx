import AdminLayout from "@/components/layouts/admin/admin-layout";
import { AdminPath } from "@/utils/global/route-path";
import { CustomAlert } from "@/utils/helper";
import { requestAxios } from "@/utils/helper/axios-helper";
import { baseUrl } from "@/utils/interfaces/constants";
import { CountLogs, CountUsers } from "@/utils/interfaces/server-props";
import { count } from "console";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { IconType } from "react-icons";
import { MdCheckCircle, MdGroups, MdHistory, MdWarning } from "react-icons/md";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { setTimeout } from "timers";

export default function AdminDashboard() {
  const [profile, setProfile] = useState({
    firstname: "",
    lastname: "",
    email: "",
    role: "",
  });
  const [countLog, setCountLog] = useState<CountLogs>({
    total: 0,
    info_logs: 0,
    failure_logs: 0,
  });
  const [countUsers, setCountUsers] = useState<CountUsers>({
    actives: 0,
    inactives: 0,
  });
  const swal = withReactContent(Swal);
  const router = useRouter();

  const fetchWebData = async () => {
    try {
      const [logs, users] = await Promise.all([
        requestAxios({ url: baseUrl + "/weblog/count", method: "GET" }),
        requestAxios({ url: baseUrl + "/user/count", method: "GET" }),
      ]);
      setCountLog(logs.data);
      setCountUsers(users.data);
    } catch (error: any) {
      CustomAlert({
        linkToConfirm: AdminPath.HOME,
        confirmReload: true,
        text: error.response?.data?.message,
      });
    }
  };

  const fetchProfile = async () => {
    await requestAxios({
      url: baseUrl + "/user/me",
      method: "GET",
    })
      .then((res) => {
        setProfile(res.data);
      })
      .catch((error) => {
        return CustomAlert({
          linkToConfirm: AdminPath.HOME,
          confirmReload: true,
          text: String(error),
        });
      });
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchWebData();
    }, 500);
    return () => clearTimeout(timer);
  });

  // COMPONENTS
  const CountUsersBox = (props: CountBoxProps) => {
    return (
      <article className="rounded-md border p-3 flex flex-row gap-4 shadow-md">
        <div className="flex">
          {React.createElement(props.icon, {
            className: "text-3xl lg:text-4xl my-auto " + props.iconClass,
          })}
          {/* <MdGroups className="text-5xl my-auto" /> */}
        </div>
        <div>
          <h4 className="text-base capitalize">{props.title}</h4>
          <p className="text-xl font-semibold">{props.count}</p>
        </div>
      </article>
    );
  };

  return (
    <AdminLayout title={`Selamat datang kembali, ${profile.role} ${profile.firstname}!`}>
      <main className="flex flex-col mt-8">
        <section className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          <CountUsersBox
            title="Total Pengguna Aktif"
            count={countUsers.actives}
            icon={MdGroups}
            iconClass="text-palepurple"
          />
          <CountUsersBox
            title="Total Aktifitas"
            count={countLog.total}
            icon={MdHistory}
            iconClass="text-infoBlue"
          />
          <CountUsersBox
            title="Total Aktifitas Berhasil"
            count={countLog.info_logs}
            icon={MdCheckCircle}
            iconClass="text-successGreen"
          />
          <CountUsersBox
            title="Total Aktifitas Gagal"
            count={countLog.failure_logs}
            icon={MdWarning}
            iconClass="text-errorRed"
          />
        </section>
      </main>
    </AdminLayout>
  );
}

interface CountBoxProps {
  title: string;
  count: number;
  icon: IconType;
  iconClass?: string;
}
