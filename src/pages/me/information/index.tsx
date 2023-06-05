import UserBaseLayout from "@/components/layouts/user/layouts";
import { UserPath } from "@/utils/global/route-path";
import { defaultButtonStyle } from "@/utils/global/style";
import Link from "next/link";
import { AiFillGithub, AiFillLinkedin } from "react-icons/ai";
import { FaTelegramPlane } from "react-icons/fa";
import {
  MdBugReport,
  MdChevronLeft,
  MdContactSupport,
  MdContacts,
  MdEmail,
  MdEngineering,
  MdInfoOutline,
} from "react-icons/md";

export default function InformationPage() {
  const mailBodyUrl = "Halo,%20saya%20ingin%20melaporkan%20bug";
  const mailUrl =
    "https://mail.google.com/mail/?view=cm&fs=1&to=ariqfachry2611@gmail.com&su=Lapor%20Bug%20PofitsApp&body=" +
    mailBodyUrl;
  return (
    <UserBaseLayout classname="text-gray-700 gap-5">
      <header className="p-0 min-h-fit inline-flex flex-col gap-y-4 mb-4 md:mb-2">
        <a
          href={UserPath.HOME}
          className="text-blue hover:text-hovblue font-semibold w-fit inline-flex cursor-pointer">
          <MdChevronLeft className="my-auto text-2xl" /> <p>Kembali</p>
        </a>
      </header>
      <div className="flex flex-row gap-2">
        {/* <MdInfoOutline className="text-3xl my-auto" /> */}
        <h1 className="text-2xl my-auto text-gray-700 font-semibold select-none">
          Informasi Aplikasi dan Pengembang
        </h1>
      </div>
      <section className="flex flex-col lg:flex-row gap-x-9 gap-y-7">
        <article className="flex flex-col gap-2 col-span-2">
          <h5 className="text-lg font-semibold capitalize my-auto">Apa itu PofitsApp?</h5>
          <p className="text-base leading-8 text-justify">
            PofitsApp adalah aplikasi pencatatan dan penganggaran keuangan yang ditujukan untuk
            pemula yang ingin mulai mempelajari dan mempraktekkan pengelolaan keuangan pribadi.{" "}
            <br />
            Aplikasi ini juga merupakan bagian dari tugas akhir sebagai syarat kelulusan kami
            sebagai mahasiswa tingkat akhir. Untuk kebutuhan penelitian kami, teman-teman pengguna
            jangan lupa untuk mengisi form kepuasan pengguna ini yaa. Terima kasih!
            <br />
            <a
              href="http://bit.ly/pofitsapp-user-acceptance-survey"
              target="_blank"
              rel="noreferrer"
              className="text-blue font-semibold hover:text-hovblue hover:underline">
              Survei Kepuasan Pengguna
            </a>
          </p>
          <div className="rounded-md border border-blue shadow-sm shadow-palepurple p-3 flex flex-col gap-3 ">
            <h5 className="text-lg font-semibold capitalize my-auto">Laporkan Bug</h5>
            <p className="leading-7 text-base">
              Jika kamu menemukan bug, error, atau kerusakan pada sistem, harap melaporkan bug
              kepada kami melalui tombol dibawah. Diharapkan mendeskripsikan dan memberikan gambaran
              atau screenshot (jika ada).
            </p>
            <a
              href={mailUrl}
              target="_blank"
              rel="noreferrer"
              className={
                defaultButtonStyle + " flex flex-row gap-1 bg-blue hover:bg-hovblue text-white"
              }>
              <MdBugReport className="my-auto text-xl" />
              Laporkan Bug
            </a>
          </div>
        </article>
        <article className="flex flex-col gap-4 max-h-fit">
          <div className="flex flex-col gap-3 col-span-2 rounded-md border border-palepurple shadow-sm shadow-blue p-3">
            <div className="flex flex-row gap-2">
              {/* <MdEngineering className="text-2xl my-auto" /> */}
              <h5 className="text-lg font-semibold capitalize my-auto">Informasi Pengembang</h5>
            </div>
            <p className="leading-7 text-base text-justify">
              Halo! Perkenalkan saya Ariq Fachry, mahasiswa Universitas Negeri Surabaya. Pada
              kesempatan ini saya merupakan pengembang full-stack dari aplikasi pencatatan keuangan
              pribadi ini. Jika ada saran atau hal yang ingin ditanyakan, teman-teman pengguna dapat
              menghubungi saya melalui kontak dibawah yaa!
            </p>
            <div className="flex flex-row gap-2">
              <a href={"https://www.linkedin.com/in/ariqfachry/"} target="_blank" rel="noreferrer">
                <AiFillLinkedin className="my-auto text-3xl text-gray-600 hover:text-hovblue transition-colors duration-200 " />
              </a>
              <a href={"https://github.com/AriqF"} target="_blank" rel="noreferrer">
                <AiFillGithub className="my-auto text-3xl text-gray-600 hover:text-blue transition-colors duration-200" />
              </a>
              <a
                href={"https://mail.google.com/mail/?view=cm&fs=1&to=ariqfachry2611@gmail.com"}
                target="_blank"
                rel="noreferrer">
                <MdEmail className="my-auto text-3xl text-gray-600 hover:text-blue transition-colors duration-200" />
              </a>
              <a href={"https://t.me/ariqfachry"} target="_blank" rel="noreferrer">
                <FaTelegramPlane className="my-auto text-3xl text-gray-600 hover:text-blue transition-colors duration-200" />
              </a>
            </div>
          </div>
          {/* <ul role="list" className="marker:text-palepurple list-disc pl-5 space-y-3 text-base ">
            <li>
              Email: <span className="underline text-blue">ariqfachry2611@gmail.com</span>
            </li>
            <li>
              LinkedIn:{" "}
              <span className="underline text-blue">https://www.linkedin.com/in/ariqfachry/</span>{" "}
            </li>
          </ul> */}
        </article>
      </section>
    </UserBaseLayout>
  );
}
