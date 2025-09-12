import { useChatClone } from "@/zustand/store";
import Button from "../common/Button";
import { useNavigate } from "react-router-dom";

const WaitingConfirmation = () => {
  const height = useChatClone((store) => store.height);
  const navigate = useNavigate();
  return (
    <div
      style={{ height }}
      className={`flex w-1/2 sm:w-6/12 md:w-3/12 m-auto text-center flex-col justify-start items-center space-y-5 `}
    >
      <h3 className="text-white text-2xl font-bold font-story">OzoneGPT</h3>
      <h1 className="text-white font-bold text-4xl">Confirm Email Address</h1>
      <p className="text-[#b1b1b1]">
        We're waiting for you to confirm your email address. Please check your
        inbox.
      </p>
      <p className="text-[#b1b1b1]">
        ✨ If the email address is valid, a confirmation message has been sent.
      </p>
      <p className="text-[#b1b1b1]">
        ✨ Once you've confirmed your email, click the button below to continue
        and log in.
      </p>

      <Button
        name="Continue"
        className="w-full"
        variant="dark"
        radius="full"
        size="lg"
        onClick={() => navigate("/login")}
      />
      <div className=" relative  border-b border-gray-400 w-full">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white bg-[#232222] px-2">
          OR
        </div>
      </div>
      <Button
        name="Go Back"
        className="w-full"
        variant="light"
        radius="full"
        size="lg"
        onClick={() => navigate("/signin")}
      />
    </div>
  );
};

export default WaitingConfirmation;
