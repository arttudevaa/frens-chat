import React from "react";

type ComponentProps = {
  username: string;
  status: string;
};

export default function UserInfo({ username, status }: ComponentProps) {
  return (
    <div className="flex gap-2">
      <div className="avatar online placeholder">
        <div className="bg-neutral text-neutral-content w-12 rounded-full">
          <span className="text-xl">{username.slice(0, 1).toUpperCase()}</span>
        </div>
      </div>
      <div>
        <p>{username}</p>
        <p>{status}</p>
      </div>
    </div>
  );
}
