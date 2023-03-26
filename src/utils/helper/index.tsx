import moment from "moment";
import Router from "next/router";
import { KeyboardEvent, useEffect, useRef, useState } from "react";
import Swal, { SweetAlertIcon, SweetAlertOptions } from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

type AlertOptions = {
  title?: string;
  text?: string;
  icon?: SweetAlertIcon;
  linkToConfirm?: string;
  reverseColor?: boolean;
};

type SelectInputOption = {
  value: number | string;
  label: string;
};

export const listOfMonth: SelectInputOption[] = [
  { value: 1, label: "Januari" },
  { value: 2, label: "Februari" },
  { value: 3, label: "Maret" },
  { value: 4, label: "April" },
  { value: 5, label: "Mei" },
  { value: 6, label: "Juni" },
  { value: 7, label: "Juli" },
  { value: 8, label: "Agustus" },
  { value: 9, label: "September" },
  { value: 10, label: "Oktober" },
  { value: 11, label: "November" },
  { value: 12, label: "Desember" },
];
export const getListOfYears = (): number[] => {
  let startYear = new Date().getFullYear();
  let years: number[] = [];
  while (startYear <= 2035) {
    years.push(startYear++);
  }
  return years;
};

export const CustomAlert = async (options?: AlertOptions) => {
  const swal = withReactContent(Swal);

  return swal
    .fire({
      title: options?.title ? options.title : "Terjadi kesalahan dalam proses data",
      text: options?.text ? options.text : "",
      icon: options?.icon ? options.icon : "error",
      confirmButtonColor: options?.reverseColor ? "#cb1a52" : "#8c4dcb",
      cancelButtonColor: options?.reverseColor ? "#8c4dcb" : "#cb1a52",
    })
    .then((res) => {
      if (res.isConfirmed) {
        if (options?.linkToConfirm) {
          Router.push(options.linkToConfirm);
          return;
        }
        Router.back();
      }
    });
};

export const smoothScroll = (elementId: string, headerHeight: number) => {
  const scrollElement = document.getElementById(elementId)?.offsetTop || 0;
  window.scrollTo({ top: scrollElement - headerHeight, behavior: "smooth" });
};

export const redirectToNewPage = (url: string, isNewTab?: boolean) => {
  const link = document.createElement("a");
  link.href = url;
  if (isNewTab) link.target = "_blank";
  link.click();
  link.remove();
};

export const useDetectClickOut = <T extends HTMLElement, U extends HTMLElement>(
  initState: boolean
) => {
  const triggerRef = useRef<U>(null);
  const nodeRef = useRef<T>(null);

  const [show, setShow] = useState<boolean>(initState);
  const handleClickOutside = (event: MouseEvent) => {
    const trigger = triggerRef.current?.contains(event.target as Node | null);
    const node = nodeRef.current?.contains(event.target as Node | null);

    if (trigger && !node) {
      if (show) setShow(false);
      else setShow(true);
    } else if (!trigger && node) setShow(false);
    else if (!trigger && !node) setShow(false);
    else setShow(false);
  };
  const firstInit = () => {
    document.addEventListener("click", (evt) => handleClickOutside(evt), true);
    return () => {
      document.removeEventListener("click", (evt) => handleClickOutside(evt), true);
    };
  };
  useEffect(firstInit, []);
  return {
    triggerRef,
    nodeRef,
    show,
    setShow,
  };
};

export const replaceAlphabetInDigits = (val: string) => {
  return val.replace(/[^\d,]+/g, "");
};

export const numFormatter = (n: string | number | bigint, decimalSymbol?: string) => {
  if (Number(n) > 0) {
    const splitNumber = String(n).split(decimalSymbol || ".");
    if (splitNumber.length > 1)
      return splitNumber[0].replace(/(.)(?=(\d{3})+$)/g, "$1.") + `,${splitNumber[1]}`;
    else return String(n).replace(/(.)(?=(\d{3})+$)/g, "$1.");
  } else {
    const splitNumber = String(Number(n) * -1).split(decimalSymbol || ".");
    if (splitNumber.length > 1)
      return "-" + splitNumber[0].replace(/(.)(?=(\d{3})+$)/g, "$1.") + `,${splitNumber[1]}`;
    else return String(n).replace(/(.)(?=(\d{3})+$)/g, "$1.");
  }
};

export const getNumOnlyFromStr = (num: string): number => {
  return parseInt(num.replace(/\./g, ""));
};

export const onKeyPressHandler = (evt: KeyboardEvent<HTMLInputElement>) => {
  const allowedKeys = [
    "1",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "0",
    "Delete",
    "Backspace",
    "ArrowLeft",
    "ArrowUp",
    "ArrowDown",
    "ArrowRight",
  ];
  const finder = allowedKeys.find((key) => key === evt.key);

  if (!finder) evt.preventDefault();
};

export const capitalizeFirstLetter = (string: string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

export const debounce = <T extends (...args: any) => any>(func: T, wait?: number) => {
  let timeout: NodeJS.Timeout | number | undefined;
  return (...args: any) => {
    const later = () => {
      timeout = undefined;

      func(...args);
    };
    clearTimeout(timeout as number | undefined);

    timeout = setTimeout(later, wait);
  };
};

// Hook func vers.
export const useDebounce = <T extends (...args: any) => any>(
  func: T,
  args: Array<any>,
  wait?: number,
  funcBeforeDebounce?: () => void
) => {
  const debounceProcess = useRef(debounce(func, wait));

  const listener = () => {
    if (funcBeforeDebounce) funcBeforeDebounce();
    debounceProcess.current(...args);
  };

  useEffect(listener, [...args]);
};

export const convertDate = (dateInit: string) => {
  if (dateInit.includes("T")) {
    const newDate = new Date(dateInit);
    const month = newDate.toLocaleString("default", { month: "long" });
    const day = newDate.toLocaleString("default", { day: "numeric" });
    const dayword = newDate.toLocaleString("default", { weekday: "long" });
    const year = newDate.toLocaleString("default", { year: "numeric" });
    const time = newDate.toLocaleTimeString();

    return (
      <div>
        {`${month}, ${day} ${year}
		${dayword}`}
        <span style={{ display: "block" }}>{time}</span>
      </div>
    );
  }
  return "";
};

export const textTrunc = (text: string, length: number) => {
  let tempText: string;
  if (text.length > length) {
    tempText = text.substring(0, length) + "...";
    return tempText;
  }
  return text;
};
