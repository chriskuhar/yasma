import { Button } from "@material-tailwind/react";
import {useMailStore} from "@/stores/mail-store";
import UseApi from "@/hooks/UseApi";
import { redirect } from "next/navigation";
import {MdLogout} from "react-icons/md";

export function Header() {
  const setComposeModalDialogOpen = useMailStore((state) => state.setComposeModalDialogOpen);
  const handleCompose = () => {
    setComposeModalDialogOpen(true);
  }
  const handleLogout = () => {
    const api = new UseApi();
    api.logout();
    redirect('/login')
  }
  return (
    <>
      <div className="page-header flex justify-between items-center">
        <div>
          <Button
            size="sm"
            color="blue"
            onClick={() => handleCompose()}
          >
            Compose
          </Button>
        </div>
        <div className="flex flex-row w-auto">
          <div>Chris Kuhar</div>
          <div onClick={() => handleLogout()} className={`cursor-pointer mt-1 ml-3`}><MdLogout/></div>
        </div>
      </div>
    </>
  );
}
