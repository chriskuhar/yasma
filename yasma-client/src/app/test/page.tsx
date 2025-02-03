'use client'
import { Button } from "@material-tailwind/react";

export default function Page() {
  return (
      <div className="flex flex-col h-screen w-screen bg-purple-500">
        <header className="w-screen h-20 bg-yellow-100"></header>
        <div className="flex  w-screen h-full bg-blue-700">
          <div className="flex-grow-0  flex-shrink-0 h-full w-40 bg-red-400 ">LHS</div>
          <div className="basis-full h-full bg-green-50 ">
            <div className="flex flex-col  h-full w-full bg-yellow-100">
              <div className="basis-1/2 bg-red-900">
                <Button>Hit Me</Button>

              </div>
              <div className="basis-1/2 bg-green-900">

              </div>
            </div>

          </div>
        </div>
        <footer className="w-screen h-20 bg-yellow-100"></footer>
      </div>
  );
}
