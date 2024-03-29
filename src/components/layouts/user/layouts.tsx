import UserNavigation from "@/components/tools/navigations/user";
import { AuthPath } from "@/utils/global/route-path";
import { requestAxios } from "@/utils/helper/axios-helper";
import { baseUrl } from "@/utils/interfaces/constants";
import { AxiosError } from "axios";
import Cookies from "js-cookie";
import { useRouter } from "next/router";
import { ReactNode, useEffect, useState } from "react";

interface Props {
  children: ReactNode;
  classname?: string;
}
export default function UserBaseLayout(props: Props) {
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const router = useRouter();

  const fetchProfile = async () => {
    const response = await requestAxios({
      url: baseUrl + "/user/me",
      method: "GET",
    })
      .then((response) => {
        setFirstname(response.data.firstname);
        setLastname(response.data.lastname);
        setUserEmail(response.data.email);
      })
      .catch((error: AxiosError) => {
        alert(error);
        router.push(AuthPath.LOGIN);
        Cookies.remove("accessToken");
      });
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  return (
    <>
      <UserNavigation firstname={firstname} lastname={lastname} userEmail={userEmail} />
      <main className={" p-4 md:ml-64 md:bg-white bg-white max-h-fit"}>
        <div className={props.classname + " flex flex-col mt-20 md:mx-5"}>{props.children}</div>
      </main>
    </>
  );
}
