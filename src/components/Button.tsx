import { useRouter } from "next/navigation";
import React from "react";

export const MainButton = (props: { text: string; path?: string }) => {
  const router = useRouter();
  return (
    <button
      className="bg-black rounded-lg"
      onClick={() => {
        router.push(props.path as string);
      }}
    >
      <span
        className="bg-[#f2994a] block p-4 -translate-y-1 border-black border-2 rounded-lg text-2xl
      hover:-translate-y-2 active:translate-x-0 active:translate-y-0 transition-all"
      >
        {props.text}
      </span>
    </button>
  );
};
