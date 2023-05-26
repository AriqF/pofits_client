import { UserPath } from "@/utils/global/route-path";
import { ReactNode, useEffect, useState } from "react";
import { MdChevronLeft } from "react-icons/md";
import UserBaseLayout from "../layouts";
import UserSideBar from "@/components/tools/sidebar/user/sidebar";
import NavTopBar from "@/components/tools/sidebar/user/top-bar";
import { requestAxios } from "@/utils/helper/axios-helper";
import { baseUrl } from "@/utils/interfaces/constants";
import Link from "next/link";

interface Props {
  children: ReactNode;
  backTo?: UserPath;
}

export default function TransactionLayout(props: Props) {
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [userEmail, setUserEmail] = useState("");
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
      <UserBaseLayout>
        <header className="p-0 min-h-fit inline-flex flex-col gap-y-4 mb-4 md:mb-2">
          {props.backTo ? (
            <Link
              href={props.backTo}
              className="text-blue hover:text-hovblue font-semibold inline-flex cursor-pointer">
              <MdChevronLeft className="my-auto text-2xl" /> <p>Kembali</p>
            </Link>
          ) : (
            ""
          )}
        </header>
        <section
          className={
            "min-h-screen lg:mb-0 lg:grid lg:grid-cols-4 lg:gap-x-10 space-y-4 md:space-y-0 "
          }>
          {props.children}
        </section>
      </UserBaseLayout>
    </>
  );
}
