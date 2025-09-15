import React, { useCallback, useEffect, useRef, useState } from "react";
import { LiveProvider, LiveEditor, LiveError, LivePreview } from "react-live";

const scope = { React };

export default function Preview({ code }: { code: string }) {
  const codes = `

 function Test() {
 const [state,newState] = useState<number>(0)
  return (
    <div className="bg-black p-5">
    <button className="bg-red-500 text-white p-2" onClick={() => newState(state + 1)}
>CLICK ME</button>
      <h1 className="text-red-500 text-lg">HI THERE {state}</h1>
    </div>
  );
}
`;
  const scope = { React, useState, useEffect, useRef, useCallback };
  return (
    <div className="p-4">
      <LiveProvider code={codes} scope={scope}>
        <div className="border p-2 mb-2 rounded bg-white">
          <LivePreview />
        </div>
        <LiveError className="text-red-500" />
        {/* <LiveEditor className="border rounded bg-gray-900 text-white p-2" /> */}
      </LiveProvider>
    </div>
  );
}
