"use client";
import React, { useContext, useEffect, useState } from "react";
import {
  SandpackProvider,
  SandpackLayout,
  SandpackCodeEditor,
  SandpackFileExplorer,
} from "@codesandbox/sandpack-react";
import Lookup from "@/app/data/Lookup";
import axios from "axios";
import Prompt from "@/app/data/Prompt";
import { useConvex, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useParams } from "next/navigation";
import { MessagesContext } from "@/context/MessagesContext";
import { Loader2Icon } from "lucide-react";
import { countToken } from "./ChatView";
import { UserDetailContext } from "@/context/UserDetailContext";
import SandpackPreviewClient from "./SandpackPreviewClient";
import { ActionContext } from "@/context/ActionContext";

function CodeView() {
  const { id } = useParams();
  const convex = useConvex();

  const { userDetail, setUserDetail } = useContext(UserDetailContext);
  const { messages } = useContext(MessagesContext);
  const { action } = useContext(ActionContext);

  const [activeTab, setActiveTab] = useState("code");
  const [files, setFiles] = useState(Lookup?.DEFAULT_FILE);
  const [loading, setLoading] = useState(false);

  const updateFiles = useMutation(api.workspace.updateFiles);
  const updateToken = useMutation(api.users.updateToken);

  // ✅ Load existing files
  useEffect(() => {
    if (id) getFiles();
  }, [id]);

  const getFiles = async () => {
    setLoading(true);
    try {
      const result = await convex.query(api.workspace.getWorkspace, {
        workspaceId: id,
      });
      const mergedFiles = { ...Lookup.DEFAULT_FILE, ...result?.fileData };
      setFiles(mergedFiles);
    } catch (err) {
      console.error("Error loading files:", err);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Auto switch to preview when action changes
  useEffect(() => {
    if (action) setActiveTab("preview");
  }, [action]);

  // ✅ Trigger AI code gen when user sends message
  useEffect(() => {
    if (messages?.length > 0) {
      const last = messages[messages.length - 1];
      if (last.role === "user") generateAiCode();
    }
  }, [messages]);

  const generateAiCode = async () => {
    setLoading(true);
    try {
      const PROMPT = JSON.stringify(messages) + " " + Prompt.CODE_GEN_PROMPT;
      const result = await axios.post("/api/gen-ai-code", { prompt: PROMPT });

      const aiResp = result.data;
      const mergedFiles = { ...Lookup.DEFAULT_FILE, ...aiResp?.files };
      setFiles(mergedFiles);

      await updateFiles({
        workspaceId: id,
        files: aiResp?.files,
      });

      const usedTokens = countToken(JSON.stringify(aiResp));
      const token = Number(userDetail?.token) - usedTokens;

      await updateToken({ userId: userDetail?._id, token });
      setUserDetail((prev) => ({ ...prev, token }));

      setActiveTab("code");
    } catch (err) {
      console.error("AI code gen error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative bg-white w-full h-full">
      {/* Tabs Header */}
      <div className="bg-white border-b p-2">
        <div
          className="flex items-center flex-wrap shrink-0 
                bg-gray-100 p-1 justify-center rounded-full
                w-[160px] gap-3"
        >
          <h2
            onClick={() => setActiveTab("code")}
            className={`text-sm cursor-pointer ${
              activeTab === "code"
                ? "text-blue-600 bg-blue-100 p-1 px-3 rounded-full"
                : "text-gray-600"
            }`}
          >
            Code
          </h2>
          <h2
            onClick={() => setActiveTab("preview")}
            className={`text-sm cursor-pointer ${
              activeTab === "preview"
                ? "text-blue-600 bg-blue-100 p-1 px-3 rounded-full"
                : "text-gray-600"
            }`}
          >
            Preview
          </h2>
        </div>
      </div>

      {/* Sandpack Environment */}
      <SandpackProvider
        files={files}
        template="react"
        theme="light"
        customSetup={{
          dependencies: { ...Lookup.DEPENDANCY },
        }}
        options={{
          externalResources: [
            "https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4",
          ],
        }}
      >
        <SandpackLayout>
          {activeTab === "code" ? (
            <>
              <SandpackFileExplorer style={{ height: "80vh" }} />
              <SandpackCodeEditor style={{ height: "80vh" }} />
            </>
          ) : (
            <SandpackPreviewClient />
          )}
        </SandpackLayout>
      </SandpackProvider>

      {/* Loading Overlay */}
      {loading && (
        <div className="p-10 bg-white bg-opacity-90 absolute top-0 w-full h-full flex flex-col items-center justify-center rounded-lg">
          <Loader2Icon className="animate-spin h-10 w-10 text-blue-500 mb-2" />
          <h2 className="text-gray-800">Generating your files...</h2>
        </div>
      )}
    </div>
  );
}

export default CodeView;
