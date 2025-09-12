import { useChatClone } from "@/zustand/store";
import Button from "../common/Button";
import { useNavigate } from "react-router-dom";
import { BiCheckCircle } from "react-icons/bi";

const ConfirmSuccess = () => {
  const height = useChatClone((store) => store.height);
  const navigate = useNavigate();

  return (
    <div
      style={{ height }}
      className="flex w-1/2 sm:w-6/12 md:w-4/12 m-auto text-center flex-col justify-start items-center space-y-5"
    >
      <h3 className="text-white text-2xl font-bold font-story">OzoneGPT</h3>

      <BiCheckCircle className="w-16 h-16 text-green-500" />

      <h1 className="text-white font-bold text-3xl">
        Email Confirmed Successfully 🎉
      </h1>

      <p className="text-[#b1b1b1]">
        Your email address has been successfully verified.
      </p>
      <p className="text-[#b1b1b1]">
        You can now log in to access your account.
      </p>

      <Button
        name="Go to Login"
        className="w-80"
        variant="dark"
        radius="full"
        size="lg"
        onClick={() => navigate("/login")}
      />
    </div>
  );
};

export default ConfirmSuccess;
