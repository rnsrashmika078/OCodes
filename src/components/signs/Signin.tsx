import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import Button from "../common/Button";
import {  BsGoogle, BsMicrosoft } from "react-icons/bs";
import { useChatClone } from "@/zustand/store";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/supabase/Supabase";

const Signin = () => {
  const setNotification = useChatClone((store) => store.setNotification);
  // data
  type Credentials = {
    name: string;
    email: string;
    password: string;
  };
  const [credentials, setCredentials] = useState<Credentials>({
    name: "",
    email: "",
    password: "",
  });
  //
  const height = useChatClone((store) => store.height);
  const [focus, setFocus] = useState<{ btn: string; isFocused: boolean }>({
    btn: "",
    isFocused: false,
  });
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const nameRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (emailRef.current?.contains(e.target as Node)) {
        setFocus({ btn: "email", isFocused: true });
      } else if (passwordRef.current?.contains(e.target as Node)) {
        setFocus({ btn: "password", isFocused: true });
      } else if (nameRef.current?.contains(e.target as Node)) {
        setFocus({ btn: "name", isFocused: true });
      } else {
        setFocus({ btn: "", isFocused: false });
      }
    };
    window.addEventListener("mousedown", handleClickOutside);
    return () => window.removeEventListener("mousedown", handleClickOutside);
  }, []);
  const buttons = [
    { name: "Google", icon: <BsGoogle size={20} /> },
    { name: "Microsoft Account", icon: <BsMicrosoft size={20} /> },
    // { name: "Apple", icon: <BsApple size={20} /> },
    // { name: "phone", icon: <BsPhone size={20} /> },
  ];
  type Inputs = {
    name: string;
    placeholder: string;
    ref: React.RefObject<HTMLInputElement>;
  };
  const inputFields: Inputs[] = [
    { name: "name", placeholder: "Your name", ref: nameRef },
    { name: "email", placeholder: "Email address", ref: emailRef },
    { name: "password", placeholder: "Password", ref: passwordRef },
  ];

  const navigate = useNavigate();

  const handleSignIn = async () => {
    const { data, error } = await supabase.auth.signUp({
      email: credentials.email,
      password: credentials.password,
      options: {
        emailRedirectTo: "http://localhost:5173/confirmationSuccess",
        // or your deployed URL: https://myapp.com/login
      },
    });

    if (error) {
      setNotification(`Sign up error:, ${error.message}`);
    } else {
      console.log("Check your email for confirmation link", data);
      navigate("/confirmation");
    }
  };

  return (
    <div
      style={{ height }}
      className={`flex w-1/2 sm:w-6/12 md:w-3/12 m-auto text-center flex-col justify-start items-center space-y-5 `}
    >
      <h3 className="text-white text-2xl font-bold font-story">OzoneGPT</h3>
      <h1 className="text-white font-bold text-4xl">Log in or sign up</h1>
      <p className="text-[#b1b1b1] ">
        You'll get smarter responses and can upload files,images, and more.
      </p>
      {inputFields.map((field: Inputs) => (
        <div className="relative w-full">
          <input
            ref={field.ref}
            name={field.placeholder}
            // @ts-expect-error: this is know error
            value={credentials[field.name]}
            onChange={(e) =>
              setCredentials((prev) => ({
                ...prev,
                [field.name]: e.target.value,
              }))
            }
            className="text-white w-full pl-8 p-3 z-0 rounded-full border focus:placeholder-transparent bg-[#232222]  mt-2 border-gray-500 placeholder:text-[#ffffff] focus:outline-none ring-0 focus:ring-1 focus:ring-blue-300 transition-all"
            placeholder={field.placeholder}
          />
          <motion.p
            animate={{
              y: focus.btn === field.name && focus.isFocused ? 2 : 26,
              opacity: focus.btn === field.name && focus.isFocused ? 1 : 0,
            }}
            transition={{ duration: 0.1, ease: "easeInOut" }}
            className="pointer-events-none z-0 select-none text-sm absolute text-white px-2 bg-[#232222]  w-fit -top-1 left-6"
          >
            {field.placeholder}
          </motion.p>
        </div>
      ))}

      <Button
        name="Continue"
        className="w-full"
        variant="dark"
        radius="full"
        size="lg"
        onClick={() => handleSignIn()}
      />

      <div className=" relative  border-b border-gray-400 w-full">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white bg-[#232222] px-2">
          OR
        </div>
      </div>
      {buttons.map((btn) => (
        <Button
          name={`Continue with ${btn.name}`}
          className="w-full"
          variant="light"
          radius="full"
          size="lg"
          textAlign="left"
        >
          {btn.icon}
        </Button>
      ))}
    </div>
  );
};

export default Signin;
