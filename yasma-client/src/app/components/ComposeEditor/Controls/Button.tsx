import classNames from "classnames";
import styles from "@/app/components/ComposeEditor/Toolbar.module.css";
import React, { useEffect } from "react";
/*
  * Properties
  * active - boolean: is button active
  * onClick - function: parent action on button click
 */
export function Button( props ) {
  const [activeButton, setActiveButton] = React.useState(true);

  useEffect(() => {
    if(!props?.active) {
      setActiveButton(false);
    }
    else {
      setActiveButton(props.active);
    }
  }, [props.active]);

  const handleClick = () => {
    if(props.onClick) {
      props.onClick();
    }
  }
  return (
      <>
        <div
            className={classNames([styles.icon], {[styles.iconActive]: activeButton})}
            onClick={handleClick}
        >
          {props.children}
        </div>
      </>
  );
}
