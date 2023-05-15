import UserSideBar from "@/components/tools/sidebar/user/sidebar";
import NavTopBar from "@/components/tools/sidebar/user/top-bar";
import { requestAxios } from "@/utils/helper/axios-helper";
import { baseUrl } from "@/utils/interfaces/constants";
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
    try {
      const response = await requestAxios({
        url: baseUrl + "/user/me",
        method: "GET",
      });
      setFirstname(response.data.firstname);
      setLastname(response.data.lastname);
      setUserEmail(response.data.email);
    } catch (error) {
      alert(error);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  return (
    <>
      <NavTopBar firstname={firstname} lastname={lastname} userEmail={userEmail} />
      <UserSideBar />
      {/* <Sidebar.Item></Sidebar> */}

      <main className={" p-4 sm:ml-64 md:bg-white bg-white max-h-fit"}>
        <div className={props.classname + " flex flex-col mt-20 md:mx-5"}>{props.children}</div>
      </main>
    </>
  );
}
