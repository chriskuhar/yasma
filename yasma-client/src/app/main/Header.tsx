import { Button } from "@material-tailwind/react";
import {useMailStore} from "@/stores/mail-store";
import UseApi from "@/hooks/UseApi";
import { redirect } from "next/navigation";

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
        <div className="flex flex-col">
          <div onClick={() => handleLogout()} className={`cursor-pointer`}>Logout</div>
          <div>Chris Kuhar</div>
        </div>
      </div>
    </>
  );
}
