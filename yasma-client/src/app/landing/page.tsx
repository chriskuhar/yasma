'use client'
import {useLayoutEffect} from "react";
import UseApi from "@/hooks/UseApi";
import {redirect} from "next/navigation";

export default function Landing() {
  useLayoutEffect(async () => {
    const urlString = window.location.href;
    const url = new URL(urlString);
    const params = new URLSearchParams(url.search);

    // validate code from Google API
    const {validateGoogleCode} = UseApi();
    const result: boolean = await validateGoogleCode(params.get('code'));
    if (result) {
      redirect('/')
    } else {
      redirect('/login')
    }
  })

  return <>
    <h1>Landing Page</h1>
  </>;
}
