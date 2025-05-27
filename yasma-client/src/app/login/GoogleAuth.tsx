import {useLayoutEffect, useState} from "react";
import UseApi from "@/hooks/UseApi";
import {viewport} from "@popperjs/core";

export function GoogleAuth() {
  const [googleUrl, setGoogleUrl] = useState("");

  useLayoutEffect(() => {
    const {getGoogleAuthUrl} = UseApi();
    const getAuthUrl = async () => {
      try {
        const result = await getGoogleAuthUrl();
        if (result?.data) {
          setGoogleUrl(result.data);
        }
      } catch(error) {
        console.error(error);
      }
    }

    getAuthUrl();
  }, []);

  const iframeLayout = {
    width: "100%",
    height: "100vh",
  }
  return <>
    {googleUrl && ( <iframe src={googleUrl} title="Login with Google" style={iframeLayout}></iframe> )}
    {!googleUrl && ( <h1>Loading...</h1> )}
  </>;
}
