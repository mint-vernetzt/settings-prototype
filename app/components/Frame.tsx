import React from "react";
import { createPortal } from "react-dom";

function Frame(props: React.ButtonHTMLAttributes<HTMLIFrameElement>) {
  const { children, title, ...otherProps } = props;
  const ref = React.useRef<HTMLIFrameElement>(null);
  const container = ref?.current?.contentWindow?.document?.body;

  return (
    <iframe title={title} {...otherProps} ref={ref}>
      {container && createPortal(props.children, container)}
    </iframe>
  );
}

export default Frame;
