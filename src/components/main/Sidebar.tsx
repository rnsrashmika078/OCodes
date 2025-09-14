import { useEffect, useState } from "react";
import { GrCloudlinux, GrGallery } from "react-icons/gr";
import Profile from "@/assets/electron-logo.svg";
import { BiDockLeft, BiEdit, BiLogOut, BiSearch } from "react-icons/bi";
import { useChatClone } from "@/zustand/store";
import { supabase } from "@/supabase/Supabase";
import { FilePath, Tree, UpdateChat } from "@/types/type";
import { MdDelete } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { BsGear } from "react-icons/bs";
import Button from "../common/Button";
import { FaChevronDown, FaChevronRight } from "react-icons/fa6";

interface Props {
  toggleSidebar: () => void;
  isToggle: boolean;
}

// Recursive FileTree component


const Sidebar = ({ toggleSidebar, isToggle }: Props) => {
  const authUser = useChatClone((store) => store.authUser);
  const activeChat = useChatClone((store) => store.activeChat);
  const setActiveChat = useChatClone((store) => store.setActiveChat);
  const setNotification = useChatClone((store) => store.setNotification);
  const updateChats = useChatClone((store) => store.updateChats);
  const deleteChat = useChatClone((store) => store.deleteChat);
  const setUserMessages = useChatClone((store) => store.setUserMessages);
  const setAuthUser = useChatClone((store) => store.setAuthUser);
  const chats = useChatClone((store) => store.chats);
  const setTrackId = useChatClone((store) => store.setTrackId);

  const [hover, setHover] = useState<boolean>(false);
  const [project, setProject] = useState<FilePath>();
  const navigate = useNavigate();

  // Logout
  const logout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Logout error:", error.message);
    } else {
      setAuthUser(null);
      setNotification(null);
      navigate("/login");
    }
  };

  const style = `px-2 text-sm custom-scrollbar bg-[#161515] flex flex-col justify-between z-[10000] transition-all ${
    isToggle
      ? "w-[350px] opacity-100 fixed md:relative"
      : "w-0 opacity-0 fixed md:relative md:opacity-100 md:w-[56px]"
  } h-full border-r border-[#3d3d3d] overflow-x-hidden`;

  return (
    <div className={style}>
      <div className="flex-shrink-0">
        {/* Top icons */}
        <div className="border-b shadow-md border-[#393939] sticky top-0 bg-[#161515] py-2">
          {isToggle ? (
            <div className="transition-all flex w-full justify-between mb-5 ">
              <GrCloudlinux
                color="white"
                size={40}
                className="hover:bg-[#5a5a5a] rounded-xl p-2"
              />
              <BiDockLeft
                color="white"
                size={40}
                className="hover:bg-[#5a5a5a] rounded-xl p-2"
                onClick={toggleSidebar}
              />
            </div>
          ) : (
            <div
              className="transition-all flex w-full mb-5"
              onMouseEnter={() => setHover(true)}
              onMouseLeave={() => setHover(false)}
            >
              {hover ? (
                <BiDockLeft
                  color="white"
                  size={40}
                  className="hover:bg-[#5a5a5a] rounded-xl p-2"
                  onClick={toggleSidebar}
                />
              ) : (
                <GrCloudlinux
                  color="white"
                  size={40}
                  className="hover:bg-[#5a5a5a] rounded-xl p-2"
                />
              )}
            </div>
          )}
        </div>

        {isToggle && (
          <div className="relative">
            <div className="h-[500px] overflow-auto space-y-2">
              {project && <FileTree nodes={project.tree} project={project} />}
            </div>
            <Button
              className="absolute"
              name="Upload"
              onClick={async () =>
                setProject(await window.fsmodule.pickProject())
              }
            />
          </div>
        )}
      </div>

      {/* Bottom user info */}
      <div className="flex flex-col border-t border-[#393939] gap-2 py-1 mb-2 sticky bottom-0">
        {/* Profile */}
        <div className="flex gap-2 justify-start items-center hover:bg-[#444444] rounded-xl px-2 py-1 w-full">
          <img src={Profile} className="w-6 h-6 flex-shrink-0" />
          {isToggle && (
            <div>
              <p>{authUser?.fname + " " + authUser?.lname}</p>
              <p className="text-[#a5a5a5]">You</p>
            </div>
          )}
        </div>

        {/* Settings */}
        <div className="flex gap-2 justify-start items-center hover:bg-[#444444] rounded-xl px-2 py-1 w-full">
          <BsGear size={20} />
          {isToggle && <p>Settings</p>}
        </div>

        {/* Logout */}
        <div
          className="flex gap-2 justify-start items-center hover:bg-[#444444] rounded-xl px-2 py-1 w-full"
          onClick={logout}
        >
          <BiLogOut size={20} />
          {isToggle && <p>Logout</p>}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
