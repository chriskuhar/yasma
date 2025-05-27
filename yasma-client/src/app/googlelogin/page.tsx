import {useLayoutEffect, useState} from "react";
import UseApi from "@/hooks/UseApi";

export function GoogleLogin() {
  const [googleUrl, setGoogleUrl] = useState("");

  useLayoutEffect(async () => {
    const {getGoogleAuthUrl} = UseApi();
    const result = await getGoogleAuthUrl();
    if (result) {
      setGoogleUrl(result);
    }
  }, []);

  const iframeLayout = {
    width: "100%",
    height: "100%",
  }
  return <>
    <iframe src={googleUrl} title="Login with Google" style={iframeLayout}></iframe>
  </>;
}
