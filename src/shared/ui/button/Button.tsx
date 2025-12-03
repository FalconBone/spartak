import React from "react";
import "./Button.scss";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  size?: "default" | "icon";
};

export function Button({
  children,
  size = "default",
  className = "",
  ...props
}: ButtonProps) {
  return (
    <button className={`ui-button ${size} ${className}`} {...props}>
      {children}
    </button>
  );
}
