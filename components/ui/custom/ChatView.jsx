"use client";

import { api } from "@/convex/_generated/api";
import { useConvex, useMutation } from "convex/react";
import { useParams } from "next/navigation";
import React, { useContext, useEffect, useState } from "react";
import { MessagesContext } from "@/context/MessagesContext";
import { UserDetailContext } from "@/context/UserDetailContext";
import Image from "next/image";
import { ArrowRight, Loader2Icon, Plus } from "lucide-react"; // ✅ Plus added
import Lookup from "@/app/data/Lookup";
import axios from "axios";
import Prompt from "@/app/data/Prompt";
import ReactMarkdown from "react-markdown";
import { useSidebar } from "../sidebar";
import { toast } from "sonner";

// ✅ Utility: count tokens
export const countToken = (inputText) =>
  inputText.trim().split(/\s+/).filter(Boolean).length;

function ChatView() {
  const { id } = useParams();
  const convex = useConvex();

  const { userDetail, setUserDetail } = useContext(UserDetailContext);
  const { messages, setMessages } = useContext(MessagesContext);

  const [userInput, setUserInput] = useState("");
  const [loading, setLoading] = useState(false);

  const updateMessages = useMutation(api.workspace.updateMessages);
  const updateToken = useMutation(api.users.updateToken);

  const { toggleSidebar } = useSidebar();

  // ✅ Load workspace messages
  useEffect(() => {
    if (id) getWorkspaceData();
  }, [id]);

  const getWorkspaceData = async () => {
    try {
      const result = await convex.query(api.workspace.getWorkspace, {
        workspaceId: id,
      });
      setMessages(result?.messages || []);
    } catch (err) {
      console.error("Error fetching workspace:", err);
    }
  };

  // ✅ Trigger AI response when new user message is added
  useEffect(() => {
    if (messages?.length > 0) {
      const last = messages[messages.length - 1];
      if (last.role === "user") getAiResponse(last);
    }
  }, [messages]);

  const getAiResponse = async () => {
    setLoading(true);
    try {
      const PROMPT = JSON.stringify(messages) + Prompt.CHAT_PROMPT;
      const result = await axios.post("/api/ai-chat", { prompt: PROMPT });

      const aiResp = { role: "ai", content: result.data.result };

      // update frontend messages
      setMessages((prev) => [...prev, aiResp]);

      // ✅ update messages in Convex workspaces
      await updateMessages({
        workspaceId: id,
        messages: [...messages, aiResp],
      });

      // Update token usage
      const usedTokens = countToken(JSON.stringify(aiResp));
      const token = Number(userDetail?.token) - usedTokens;

      setUserDetail((prev) => ({ ...prev, token }));
      await updateToken({ userId: userDetail?._id, token });
    } catch (err) {
      console.error("AI error:", err);
      toast("Something went wrong with AI response.");
    } finally {
      setLoading(false);
    }
  };

  const onGenerate = (input) => {
    if (userDetail?.token < 10) {
      toast("You don't have enough tokens!");
      return;
    }
    setMessages((prev) => [...prev, { role: "user", content: input }]);
    setUserInput("");
  };

  // ✅ File Upload
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      toast.success(`Uploaded: ${file.name}`);
      // TODO: upload logic here
    }
  };

  return (
    <div className="relative h-[85vh] flex flex-col bg-white">
      {/* Messages */}
      <div className="flex-1 overflow-y-scroll scrollbar-hide px-5 py-3">
        {messages?.map((msg, index) => (
          <div
            key={index}
            className="p-3 rounded-lg mb-3 flex gap-3 items-start leading-7 bg-gray-100"
          >
            {msg.role === "user" && (
              <Image
                src={userDetail?.picture || "/default-user.png"}
                alt="userImage"
                width={35}
                height={35}
                className="rounded-full"
              />
            )}

            <div className="flex flex-col text-gray-800">
              <ReactMarkdown>{msg.content}</ReactMarkdown>
            </div>
          </div>
        ))}

        {loading && (
          <div className="p-3 rounded-lg mb-2 flex gap-2 items-center bg-gray-200">
            <Loader2Icon className="animate-spin text-gray-600" />
            <h2 className="text-gray-600">Generating response...</h2>
          </div>
        )}
      </div>

      {/* Input Section */}
      <div className="flex gap-2 items-end px-5 py-3 border-t bg-white relative">
        {userDetail && (
          <Image
            src={userDetail?.picture || "/default-user.png"}
            className="rounded-full cursor-pointer"
            onClick={toggleSidebar}
            alt="user"
            width={30}
            height={30}
          />
        )}
        <div className="p-4 border rounded-xl max-w-2xl w-full bg-gray-50 relative">
          <div className="flex gap-2 items-center">
            <textarea
              placeholder={Lookup.INPUT_PLACEHOLDER}
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              className="outline-none bg-transparent w-full h-24 max-h-56 resize-none text-gray-800"
            />

            {/* Arrow Right (Generate) - bottom-right */}
            {userInput && (
              <ArrowRight
                onClick={() => onGenerate(userInput)}
                className="absolute bottom-4 right-4 bg-blue-500 p-2 h-9 w-9 rounded-md cursor-pointer text-white hover:bg-blue-600"
              />
            )}
          </div>

          {/* ✅ Plus (Upload) - bottom-left */}
          <label
            htmlFor="chat-upload"
            className="absolute bottom-4 left-4 cursor-pointer"
            title="Attach file or folder"
          >
            <input
              id="chat-upload"
              type="file"
              onChange={handleFileUpload}
              className="hidden"
            />
            <Plus className="p-2 h-9 w-9 rounded-md text-black hover:bg-gray-200" />
          </label>
        </div>
      </div>
    </div>
  );
}

export default ChatView;
