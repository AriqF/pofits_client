import { UserPath } from "@/utils/global/route-path";
import { logoutHandler } from "@/utils/helper/axios-helper";
import TopDropdownOption from "./menu-option";

interface Props {
  username: string;
  email: string;
}

export default function UserMenuTopBar(props: Props) {
  return (
    <div
      className="z-50 hidden my-4 text-base list-none bg-white divide-y divide-gray-100 rounded shadow"
      id="dropdown-user">
      <div className="px-4 py-3" role="none">
        <p className="text-sm text-gray-900 font-semibold " role="none">
          {props.username}
        </p>
        <p className="text-sm font-medium text-gray-900 truncate" role="none">
          {props.email}
        </p>
      </div>
      <ul className="py-1" role="none">
        <TopDropdownOption linkTo={UserPath.PROFILE} text="Profile" />
        <TopDropdownOption text="Keluar" onClick={logoutHandler} />
        {/* <TopDropdownOption linkTo="#" text="Settings" /> */}
      </ul>
    </div>
  );
}