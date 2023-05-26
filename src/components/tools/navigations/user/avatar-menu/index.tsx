import { UserPath } from "@/utils/global/route-path";
import { logoutHandler } from "@/utils/helper/axios-helper";
import AvatarMenuOption from "./menu-option";

interface Props {
  username: string;
  email: string;
  show: boolean;
}

export default function UserAvatarMenu(props: Props) {
  return (
    <div
      className={
        (props.show ? "" : "hidden") +
        " absolute top-10 right-0 z-50 my-4 text-base list-none bg-white divide-y divide-gray-100 rounded shadow min-w-[12%]"
      }>
      <div className="px-4 py-3" role="none">
        <p className="text-sm text-gray-900 font-semibold " role="none">
          {props.username}
        </p>
        <p className="text-sm font-medium text-gray-900 truncate" role="none">
          {props.email}
        </p>
      </div>
      <ul className="py-1" role="none">
        <AvatarMenuOption linkTo={UserPath.PROFILE} text="Profil" />
        <AvatarMenuOption linkTo={UserPath.INFORMATION} text="Informasi" />
        <AvatarMenuOption text="Keluar" onClick={logoutHandler} />
        {/* <TopDropdownOption linkTo="#" text="Settings" /> */}
      </ul>
    </div>
  );
}
