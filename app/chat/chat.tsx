"use client";
import React, { useState, useEffect, useRef, useCallback } from "react";
import useMessages from "../_hooks/useMessages";
import useFriends from "../_hooks/useFriends";
import useKeyboardListener from "../_hooks/useKeyboardListener";
import Sidebar from "./_components/sidebar";
import Leftpane from "./_components/leftpane";
import UserInfo from "./_components/userInfo";
import MessageList from "./_components/messagelist";

type ComponentProps = {
  username: string;
};

function Chat({ username }: ComponentProps) {
  const [messages, setMessages, status] = useMessages();
  const [friends, setFriends, fstatus] = useFriends();
  const [messageInput, setMessageInput] = useState("");
  const socket = useRef<WebSocket | null>(null);
  const sendMessageRef = useRef(null);
  const chatRef = useRef<HTMLDivElement>(null);

  const sendMessage = useCallback(() => {
    if (messageInput.trim() !== "") {
      const message = {
        text: messageInput,
        sender: username,
        timestamp: new Date().toISOString(),
      };
      if (socket.current) {
        socket.current.send(JSON.stringify(message));
      } else {
        console.log("Not connected");
      }
      setMessageInput("");
    }
  }, [messageInput, username]);

  useKeyboardListener("Enter", sendMessage);

  const formatTime = (timestamp: Date) => {
    const localtime = new Date(timestamp);
    const time = `${localtime.getHours()}:${localtime.getMinutes()}`;
    return time;
  };

  useEffect(() => {
    socket.current = new WebSocket("ws://localhost:3001");
    socket.current.onopen = (event) => {
      console.log("WebSocket connection established.");
    };

    socket.current.onmessage = (event) => {
      console.log("onmessage");
      const receivedMessage = JSON.parse(event.data).message;
      setMessages((prev) => [...prev, receivedMessage]);
    };

    return () => {
      socket.current?.close();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    // This should only fire when the scroll is close to the bottom when the message arrives
    // also could show x new messages somewhere and a divider where the new messages begin
    console.log(chatRef.current);
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="flex flex-row">
      <Sidebar />
      <Leftpane>
        <MessageList />
        <UserInfo username={username} status="Online" />
      </Leftpane>
      <div className="flex min-h-screen max-h-screen flex-col justify-end grow bg-slate-700">
        <div
          ref={chatRef}
          className={status !== "error" ? "overflow-y-auto" : "p-3"}
        >
          {messages.map((message, index) => (
            <div
              key={message.id}
              className={`chat ${
                message.sender === username ? "chat-end" : "chat-start"
              }`}
            >
              <div className="chat-header">
                {message.sender}
                <time className="text-xs opacity-50 ml-2">
                  {formatTime(message.timestamp)}
                </time>
              </div>
              <div className="chat-bubble">{message.text}</div>
            </div>
          ))}
          {messages.length === 0 && status === "error" && (
            <div role="alert" className="alert alert-error">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 shrink-0 stroke-current"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span>Unable to fetch message history</span>
            </div>
          )}
        </div>

        <div className="bg-slate-700 min-w-max flex p-3 gap-3">
          <input
            className="input input-bordered input-primary grow"
            type="text"
            placeholder="Type your message"
            value={messageInput}
            onChange={(e) => setMessageInput(e.target.value)}
          />
          <button
            className="btn btn-primary"
            ref={sendMessageRef}
            onClick={() => sendMessage()}
          >
            Send
          </button>
        </div>
      </div>
      <div className="sm:hidden lg:block min-h-screen w-80 bg-slate-800"></div>
    </div>
  );
}

export default Chat;
