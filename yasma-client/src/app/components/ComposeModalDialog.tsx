import {
  Button,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Input,
} from "@material-tailwind/react";
import { useSelector } from "react-redux";
import { AppStore } from "@/lib/store";
import { useDispatch } from "react-redux";
import { setComposeModalDialogOpen } from "@/features/mail/mailboxSlice";
import { ComposeEditor } from "@/app/components/ComposeEditor";

// define your extension array

export function ComposeModalDialog() {
  const curOpenState = useSelector((state : AppStore) => state?.mailbox?.composeModalDialogOpen);
  const dispatch = useDispatch()
  const handleClose = () => dispatch(setComposeModalDialogOpen(false));

  return (
      <div className="flex flex-col ">
        <Dialog open={curOpenState} handler={handleClose} size="lg">
          <DialogHeader>New Message</DialogHeader>
          <DialogBody>
            <form className="mt-8 mb-2">
              <div className="mb-1 flex flex-col gap-1">
                <Input
                    label="To:"
                    size="md"
                    variant="standard"
                    className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
                    labelProps={{
                      className: "before:content-none after:content-none",
                    }}
                />
                <Input
                    label="Subject:"
                    size="md"
                    variant="standard"
                    className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
                    labelProps={{
                      className: "before:content-none after:content-none",
                    }}
                />
                <ComposeEditor/>
              </div>
            </form>
          </DialogBody>
          <DialogFooter>
            <Button
                variant="text"
                color="red"
                onClick={handleClose}
                className="mr-1"
            >
              <span>Cancel</span>
            </Button>
            <Button variant="gradient" color="green" onClick={handleClose}>
              <span>Send</span>
            </Button>
          </DialogFooter>
        </Dialog>
      </div>
  );
}
