import { Button } from "@material-tailwind/react";
import { useDispatch } from "react-redux";
import { setComposeModalDialogOpen } from "@/features/mail/mailboxSlice";

export function Header() {
  const dispatch = useDispatch()
  const handleCompose = () => {
    dispatch(setComposeModalDialogOpen(true));
  }
  return (
      <>
        <div className="page-header flex justify-between items-center">
          <div>
            <Button size="sm" color="blue" onClick={() => handleCompose()}>Compose</Button>
          </div>
          <div></div>
          <div>Welcome</div>
        </div>
      </>
  );
}
