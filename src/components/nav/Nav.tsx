import { useChatClone } from "@/zustand/store";
import { BsArrowLeft, BsQuestionCircle } from "react-icons/bs";
import { BsChevronDown } from "react-icons/bs";
// import BGImage from "@/assets/sample (3).jpg";
import { useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import Button from "../common/Button";
import { PiChatCircleSlash } from "react-icons/pi";
import ToolTip from "../common/ToolTip";
import { MdOutlineToggleOff } from "react-icons/md";
interface Props {
  toggleSidebar?: (state?: boolean) => void;
  isToggle?: boolean;
}
export default function Nav({ toggleSidebar }: Props) {
  const userMessages = useChatClone((store) => store.userMessages);
  const authUser = useChatClone((store) => store.authUser);
  const [visible, setVisible] = useState<boolean>(false);
  const buttonRef = useRef<HTMLDivElement | null>(null);
  const navigate = useNavigate();
  const path = window.location.pathname;

  return (
    <div className="sticky top-0 z-[9998] w-full border-b border-[#302f2f]">
      {/* use color */}
      <nav className="flex justify-between bg-[#232222]  px-5 py-1">
        {/* <Link to="/">Home</Link> | <Link to="/about">About</Link> */}
        <div className="relative flex gap-2  justify-center items-center cursor-pointer ">
          {/* use color */}
          {path !== "/" && (
            <BsArrowLeft
              color="white"
              size={32}
              className="px-2 hover:bg-[#343434] rounded-full active:scale-105 transition-all "
              onClick={() => navigate("/")}
            />
          )}
          <span
            className="block mx-2 md:hidden"
            onClick={() =>toggleSidebar?.()}
          >
            <MdOutlineToggleOff />
          </span>
          {userMessages && userMessages.length > 0 && (
            <div
              onClick={() => setVisible((prev) => !prev)}
              ref={buttonRef}
              className="flex relative justify-center items-center gap-2 hover:bg-[#393838] rounded-md px-2"
            >
              <p className="text-white">OzoneGPT</p>{" "}
              <span>
                <BsChevronDown color="white" strokeWidth={0.1} size={12} />
              </span>
            </div>
          )}

          {visible && <Card setVisible={setVisible} buttonRef={buttonRef} />}
        </div>
        <div className="flex gap-2 justify-center items-center ">
          {authUser?.authenticated ? (
            <Button
              border={false}
              size="xs"
              radius="full"
              variant="transparent"
              onClick={() => {
                // navigate("/login");
                setVisible(false);
              }}
            >
              <ToolTip tip="Start Tempory Chat" />
              <PiChatCircleSlash
                size={40}
                className="hover:bg-[#444444] rounded-md p-2"
              />
            </Button>
          ) : (
            <>
              <Button
                name="Log in"
                size="xs"
                radius="full"
                variant="light"
                onClick={() => {
                  navigate("/login");
                  setVisible(false);
                }}
              />
              <Button
                name="Sign up for free"
                size="xs"
                radius="full"
                variant="transparent"
                onClick={() => {
                  navigate("/signin");
                  setVisible(false);
                }}
              />
              <BsQuestionCircle color="white" strokeWidth={0.5} />
            </>
          )}
        </div>
      </nav>
    </div>
  );
}
interface CardProps {
  setVisible: React.Dispatch<React.SetStateAction<boolean>>;
  buttonRef: React.RefObject<HTMLDivElement>;
}
const Card = ({ setVisible, buttonRef }: CardProps) => {
  const cardRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        cardRef.current &&
        !cardRef.current.contains(e.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(e.target as Node)
      ) {
        setVisible(false);
      } else {
        setVisible(true);
      }
    };
    window.addEventListener("mousedown", handleClickOutside);
    return () => window.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const navigate = useNavigate();
  return (
    <div
      className="z-50 absolute top-7 left-2  shadow-md rounded-xl h-[150px]"
      ref={cardRef}
    >
      <div className="w-[250px] object-cover border border-gray-600 rounded-t-xl">
        <img
          // src={BGImage}
          width={250}
          className="object-cover rounded-t-xl"
          alt="cover image for card"
        ></img>
      </div>
      <div className=" rounded-b-xl border-b border-l border-r border-gray-600   -translate-y-8 p-3 bg-[#3b3b3b] flex flex-col justify-start items-start ">
        <h1 className="text-white text-md mb-2 font-bold">
          Try advanced features for free
        </h1>
        <p className="text-[#e9e9e9] text-xs">
          Get smarter responses, upload files, create images, and more by
          logging in.
        </p>
        <div className="flex gap-2 justify-center items-center mt-4">
          <Button
            name="Log in"
            size="xs"
            radius="full"
            variant="light"
            onClick={() => {
              navigate("/login");
              setVisible(false);
            }}
          />
          {/* login button */}
          <Button
            name="Sign up for free"
            size="xs"
            radius="full"
            variant="transparent"
            onClick={() => {
              navigate("/signin");
              setVisible(false);
            }}
          />
        </div>
      </div>
    </div>
  );
};
