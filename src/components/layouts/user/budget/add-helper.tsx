import Container from "@/components/tools/container";
import { MdInfoOutline } from "react-icons/md";

export default function AddBudgetHelper() {
  return (
    <Container className="border-2">
      <div className="inline-flex">
        <MdInfoOutline className="text-2xl my-auto mr-2" />
        <h3 className="text-2xl">Tambah Anggaran</h3>
      </div>
      <hr className="border-b-2" />
      <p>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut
        labore et dolore magna aliqua.
      </p>
    </Container>
  );
}
