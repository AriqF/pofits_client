import UserLayout from "@/components/layouts/user";
import UserBaseLayout from "@/components/layouts/user/layouts";

export default function MyDashboard() {
  return (
    <UserBaseLayout>
      <div className="flex md:flex-row flex-col md:space-x-4 md:space-y-0 space-y-3 mt-4 text-center m-auto"></div>
    </UserBaseLayout>
  );
}

// <UserLayout>
//   <div className="flex flex-col m-auto">
//     <div id="dev-header">
//       <h2 className="text-center text-xl">Dashboard User</h2>
//     </div>
//     <div className="flex md:flex-row flex-col md:space-x-4 md:space-y-0 space-y-3 mt-4 text-center m-auto">
//       <a href="#">Transaksi</a>

//       <a href="me/budget">Penganggaran</a>

//       <a href="me/settings/wallets">Dompet Saya</a>
//     </div>
//   </div>
// </UserLayout>
