/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEditor } from "@/lib/zustand/store";
import { memo, useEffect, useRef, useState } from "react";
import { BiRefresh } from "react-icons/bi";

const Preview = memo(() => {
  const devServerStatus = useEditor((store) => store.devServer);
  const [isServer, setIsServer] = useState<boolean>(false);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [url, setUrl] = useState<string>("http://localhost:5174/");

  const checkViteServer = async () => {
    try {
      setRefreshing(true);
      const res = await fetch("http://localhost:5174", { method: "GET" });
      if (!res.ok) console.log("cannot connect", res);
      setIsServer(true);
      setRefreshing(false);
      setUrl("http://localhost:5174/");
    } catch (err) {
      // console.log("error project", err);
      setIsServer(false);
      // setError(err)
      setRefreshing(false);
    }
  };

  useEffect(() => {
    console.log("Have changed!");
    const check = () => {
      checkViteServer();
    };
    check();
  }, [devServerStatus]);

  const webViewRef = useRef<HTMLIFrameElement | null>(null);

  useEffect(() => {
    const webView = webViewRef.current;
    if (!webView) return;

    // const handleNavigate = (event: any) => {
    //   setUrl(event.url);
    // };

    const handleInPageNavigate = (event: any) => {
      setUrl(event.url);
    };

    // webView.addEventListener("did-navigate", handleNavigate);

    webView.addEventListener("did-navigate-in-page", handleInPageNavigate);

    return () => {
      // webView.removeEventListener("did-navigate", handleNavigate);
      webView.removeEventListener("did-navigate-in-page", handleInPageNavigate);
    };
  }, [url]);
  return (
    <div className="w-full h-full">
      {/* address bar */}
      <div className="p-2 w-full">
        <input
          value={url}
          className="w-full  italic rounded-2xl focus:outline-none focus:ring-0 pl-5"
          onChange={(e) => setUrl(e.target.value)}
        ></input>
      </div>
      {/* <iframe
        onLoad={() => {
          console.log("iframe loaded");
          setUrl(url + )
        }}
        src={url}
        ref={iframeView}
        className="w-full h-full border-0"
      /> */}

      <webview ref={webViewRef} src={url} className="w-full h-full"></webview>
    </div>
    // <>
    //   <webview
    //     src="https://www.google.com/"
    //     // style="display:inline-flex; width:640px; height:480px"
    //     className="w-[640px] h-[480px]"
    //   ></webview>
    //   <button
    //     aria-label="refresh"
    //     onClick={() => checkViteServer()}
    //     className={`p-1 ${refreshing ? "animate-spin" : ""}`}
    //   >
    //     <BiRefresh color="white" size={16} />
    //   </button>

    //   {!isServer ? (
    //     <div className=" h-full overflow-y-auto w-full p-4 bg-gradient-to-bl from-[#000000] via-[#414141]  to-[#000000] ">
    //       <h1 className="text-1xl">Such a Lovely Day</h1>
    //       <p className="text-4xl">Agents are waiting for you!</p>
    //     </div>
    //   ) : (
    //     <div className=" h-full overflow-y-auto">
    //       {/* <iframe
    //         src={`http://localhost:5174/`}
    //         className="w-full h-full border-0"
    //       /> */}
    //       <webview
    //         src="https://www.google.com/"
    //         // style="display:inline-flex; width:640px; height:480px"
    //       ></webview>
    //     </div>
    //   )}
    // </>
  );
});
Preview.displayName = "Preview";

export default Preview;
