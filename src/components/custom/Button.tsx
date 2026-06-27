interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  name?: string;
  variant?: "default" | "dark" | "light" | "transparent" | "open";
  size?: "xs" | "sm" | "md" | "lg";
  radius?: "xs" | "md" | "xl" | "full";
  children?: React.ReactNode;
  textAlign?: "left" | "right" | "center";
  border?: boolean;
}

const Button = ({
  name,
  variant = "default",
  size = "md",
  radius = "xs",
  className,
  textAlign = "center",
  border = true,
  children,
  ...props
}: ButtonProps) => {
  const variants = {
    default: "bg-black/20 text-white font-bold border border-[rgba(1,1,1,1)]",
    light:
      "disabled:bg-gray-400 disabled:text-gray-500 text-xs bg-white  font-semibold hover:bg-[#dedede] text-black ",
    transparent: `text-white text-xs bg-transparent font-semibold ${
      border ? "border border-gray-400" : ""
    } `,
    open: "disabled:text-gray-500 text-xs  font-semibold hover:bg-[#dedede] text-black ",
    dark: "text-white text-xs bg-black  font-semibold hover:bg-[#141414]",
  };

  const sizes = {
    xs: "px-3 py-1.5 text-xs",
    sm: "px-3 py-1.5 text-sm",
    md: "px-3 py-2  text-base",
    lg: "px-3 py-4 text-lg",
  };
  const radiuses = {
    xs: "rounded-xs",
    md: "rounded-md",
    xl: "rounded-xl",
    full: "rounded-full",
  };

  const textAlignment = {
    left: "justify-start pl-5",
    center: "justify-center",
    right: "justify-end pr-5",
  };

  // remove: relative
  const style = `flex py-1  items-center ${textAlignment[textAlign]} transition-all gap-2 ${radiuses[radius]} ${variants[variant]} ${sizes[size]} ${className}`;
  return (
    <button className={`${style}`} {...props}>
      {children}
      {name}
    </button>
  );
};

export default Button;
