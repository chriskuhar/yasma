import React, {useEffect, useRef, useState} from "react";
import useMessageFormat from "@/hooks/UseMessageFormat";
import UseApi from "@/hooks/UseApi";
import {useMailStore} from "@/stores/mail-store";

export function MessageView() {
  const curMessage = useMailStore((state) => state.messageState);
  const { messageRender } = useMessageFormat();
  const { getMessage } = UseApi();
  const shadowRootRef = useRef(null);
  useEffect(() => {
    async function fetchData(messageID: string) {
      const result = await getMessage(messageID);
      const rawMessage = messageRender(result);
      const parser = new DOMParser();
      const targetElement = shadowRootRef.current;
      const messageDoc = parser.parseFromString(rawMessage, 'text/html');

      let wrapper = targetElement.querySelector(".shadow-wrapper");

      if (wrapper) {
          // If wrapper exists, remove it to remove the Shadow DOM root
          targetElement.removeChild(wrapper);
      }

      // Re-attach the new Shadow DOM
      wrapper = document.createElement("div");
      wrapper.className = "shadow-wrapper";
      targetElement.appendChild(wrapper);

      // Create a shadow root
      const shadowRoot = wrapper.attachShadow({ mode: "open" });
      shadowRoot.appendChild(messageDoc.documentElement);
    }
    const curMessageID = curMessage?.MessageID;
    if(curMessageID) {
      fetchData(curMessageID);
    } else {
      const targetElement = shadowRootRef.current;
      let wrapper = targetElement.querySelector(".shadow-wrapper");
      if (wrapper) {
        // If wrapper exists, remove it to remove the Shadow DOM root
        targetElement.removeChild(wrapper);
      }
    }
  }, [curMessage]);

  return (
      <>
        <div ref={shadowRootRef}>
        </div>
      </>
  );
}
