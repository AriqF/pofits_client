// import Avatar from "react-avatar";

interface Props {
  className?: string;
}

export default function SettingProfileBox(props: Props) {
  return (
    <div
      id="profile-box"
      className={
        "bg-white h-fit border-2 rounded-md shadow-md p-6 inline-flex flex-row gap-x-1 md:gap-x-5 w-full " +
        props.className
      }>
      <div id="profile-picture" className="basis-2/12 m-auto items-center flex">
        {/* <Avatar name="Ariq Fachry Ramadhan" round={true} size="70" className="m-auto" /> */}
      </div>
      <div id="profile-info" className="basis-10/12 flex flex-col my-auto text-left ml-3">
        <h2 className="text-xl lg:text-xl font-bold">Ariq Fachry</h2>
        <h4 className="text-xs lg:text-sm text-mute font-light">Pengguna sejak 20/02/2023</h4>
      </div>
    </div>
  );
}
