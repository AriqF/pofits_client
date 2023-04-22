import Image from "next/image";

interface Props {
  text?: string;
  className?: string;
  image?: string;
  linkTo?: string;
  linkText?: string;
  imageHeight?: number;
  imageWidth?: number;
}

export default function NotFoundImage(props: Props) {
  return (
    <div className={props.className + " flex flex-col m-auto place-content-center text-center"}>
      <Image
        src={`/assets/images/${props.image ? props.image : "datanotfound"}.jpg`}
        alt={"data-not-found-img"}
        height={props.imageHeight ? props.imageHeight : 100}
        width={props.imageWidth ? props.imageWidth : 100}
        className="m-auto"
      />
      <h3 className="text-xl m-auto">{props.text ? props.text : "Tidak ada data"}</h3>
      {props.linkText && props.linkTo ? (
        <a href={props.linkTo} className="text-sm text-blue hover:underline hover:text-hovblue ">
          {props.linkText}
        </a>
      ) : (
        ""
      )}
    </div>
  );
}
