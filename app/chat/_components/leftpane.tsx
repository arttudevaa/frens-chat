import React from "react";

export default function Leftpane({
  children,
}: {
  children: React.JSX.Element | React.JSX.Element[];
}) {
  return (
    <div className="flex flex-col min-h-screen w-96 bg-slate-800 px-2 py-3">
      {children}
    </div>
  );
}
