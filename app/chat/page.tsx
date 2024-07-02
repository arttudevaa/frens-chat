"use client";
import React, { useState, useRef, useEffect } from "react";
import Chat from "./chat";
import useKeyboardListener from "../_hooks/useKeyboardListener";

function Page() {
  const [username, setUsername] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  useKeyboardListener("Enter", handleSetUsername);

  async function handleSetUsername() {
    if (!inputRef.current) {
      return;
    }

    const value = inputRef.current.value.trim();

    if (value === "") {
      setErrorMsg("Username can't be empty");
      inputRef.current.value = "";
      inputRef.current.focus();
      return;
    }

    try {
      const response = await register(value);

      if (response.status === 200) {
        const data = await response.json();
        console.log(data);
        setUsername(data.username);
        setErrorMsg("");
      } else {
        const errorData = await response.json();
        setErrorMsg(errorData.error || "An unknown error occurred");
      }
    } catch (error) {
      setErrorMsg("An error occurred");
    }
  }

  async function register(username: string) {
    const response = await fetch("http://localhost:3001/register", {
      method: "POST",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify({ username }),
    });
    return response;
  }

  return (
    <div>
      {!username ? (
        <div className="min-h-screen flex flex-col justify-center items-center gap-5">
          <div className="card bg-neutral text-neutral-content min-w-96">
            <div className="card-body">
              <h2 className="card-title">Choose your username</h2>
              <div className="card-actions flex-row">
                <input
                  className="input input-bordered input-primary"
                  type="text"
                  placeholder="Username"
                  ref={inputRef}
                  onChange={() => setErrorMsg("")}
                />
                <button
                  className="btn btn-primary"
                  onClick={() => handleSetUsername()}
                >
                  Confirm
                </button>
              </div>
              <p className="text-red-400 min-h-6">{errorMsg}</p>
            </div>
          </div>
        </div>
      ) : (
        <Chat username={username} />
      )}
    </div>
  );
}

export default Page;
