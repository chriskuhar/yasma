import { Button } from "@material-tailwind/react";
import {useMailStore} from "@/stores/mail-store";

export function Header() {
  const setComposeModalDialogOpen = useMailStore((state) => state.setComposeModalDialogOpen);
  const handleCompose = () => {
    setComposeModalDialogOpen(true);
  }
  const handleLogout = () => {

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
          <div onClick={() => handleLogout()}>Logout</div>
          <div>Chris Kuhar</div>
        </div>
      </div>
    </>
  );
}
