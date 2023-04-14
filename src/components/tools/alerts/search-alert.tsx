import Image from "next/image";

interface Props {
  text?: string;
  className?: string;
}

export default function SearchAlert(props: Props) {
  return (
    <div className={props.className + " flex flex-col m-auto place-content-center"}>
      <Image
        src={`/assets/images/datanotfound.jpg`}
        alt={"data-not-found-img"}
        height={100}
        width={100}
        className="m-auto"
      />
      <h3 className="text-xl m-auto">{props.text ? props.text : "Pencarian Tidak Ditemukan"}</h3>
    </div>
  );
}
