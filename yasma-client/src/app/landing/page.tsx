'use client'
import {useLayoutEffect} from "react";
import UseApi from "@/hooks/UseApi";
import {redirect} from "next/navigation";

export default function Landing() {
  useLayoutEffect(() => {
    async function validate(): boolean {
      const urlString = window.location.href;
      const url = new URL(urlString);
      const params = new URLSearchParams(url.search);

      // validate code from Google API
      const {validateGoogleCode} = UseApi();
      const result = await validateGoogleCode(params.get('code'));
      if (result) {
        redirect('/')
      } else {
        redirect('/login')
      }
    }
    validate();
  }, [])

  return <>
    <h1>Landing Page</h1>
  </>;
}
