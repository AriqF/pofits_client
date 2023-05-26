import { Sidebar } from "flowbite-react";
import { MdFactCheck, MdHome, MdReceiptLong, MdRequestQuote } from "react-icons/md";

interface SidebarProps {
  show: boolean;
}

export default function SidebarRC(props: SidebarProps) {
  return (
    <div
      className={
        "w-fit transition-transform fixed top-0 left-0 z-40 h-screen " +
        (props.show ? "  " : "-translate-x-full sm:translate-x-0 ")
      }>
      <Sidebar aria-label="Sidebar with multi-level dropdown example">
        <Sidebar.Items>
          <Sidebar.ItemGroup>
            <Sidebar.Item href="#" icon={MdHome}>
              Dashboard
            </Sidebar.Item>
            <Sidebar.Collapse icon={MdRequestQuote} label="E-commerce">
              <Sidebar.Item href="#">Products</Sidebar.Item>
            </Sidebar.Collapse>
            <Sidebar.Item href="#" icon={MdFactCheck}>
              Inbox
            </Sidebar.Item>
            <Sidebar.Item href="#" icon={MdReceiptLong}>
              Users
            </Sidebar.Item>
          </Sidebar.ItemGroup>
        </Sidebar.Items>
      </Sidebar>
    </div>
  );
}
