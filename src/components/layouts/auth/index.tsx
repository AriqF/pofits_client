import { ReactNode } from "react";
import { BsArrowLeft } from "react-icons/bs";

interface LayoutProps {
  children: ReactNode;
  headerText: string;
  withBackButton?: boolean;
}

export default function AuthLayout(props: LayoutProps) {
  const { children, headerText, withBackButton } = props;

  return (
    <section id="auth" className="min-h-screen flex flex-col border bg-whitegrey">
      <header className="flex bg-white p-4 drop-shadow-md">
        <h1 className="text-2xl text-center m-auto font-bold"> PofitsApp</h1>
      </header>
      <div className="container max-w-2xl md:h-fit h-screen p-6 border md:rounded-lg shadow-lg m-auto bg-white space-y-5">
        <div id="login-header" className="space-y-3">
          {/* <h2 className="text-center text-2xl font-extrabold hidden md:flex m-auto">PofitsApps</h2> */}
          <div className="flex">
            <h3 className="m-auto text-center text-xl font-semibold">{headerText}</h3>
          </div>
        </div>
        {children}
      </div>
    </section>
  );
}
