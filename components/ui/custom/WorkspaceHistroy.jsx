"use client";

import { useConvex } from "convex/react";
import { api } from "@/convex/_generated/api";
import { UserDetailContext } from "@/context/UserDetailContext";
import React, { useContext, useEffect, useState } from "react";
import { useSidebar } from "../sidebar";
import Link from "next/link";

function WorkspaceHistory() {
  const { userDetail } = useContext(UserDetailContext);
  const convex = useConvex();
  const [workspaceList, setWorkspaceList] = useState([]);
  const { toggleSidebar } = useSidebar();

  useEffect(() => {
    if (userDetail?._id) {
      getAllWorkspace();
    }
  }, [userDetail]);

  const getAllWorkspace = async () => {
    try {
      const result = await convex.query(api.workspace.getAllWorkspaces, {
        userId: userDetail._id,
      });

      setWorkspaceList(result || []);

      // Log only IDs for debugging instead of 86 objects
      console.log(
        "Fetched workspaces:",
        result?.map((w) => w._id)
      );
    } catch (err) {
      console.error("Error fetching workspaces:", err);
    }
  };

  return (
    <div>
      <h2 className="font-medium text-lg">Your Chats</h2>
      <div>
        {workspaceList.length > 0 ? (
          workspaceList.map((workspace) => (
            <Link href={`/workspace/${workspace._id}`} key={workspace._id}>
              <h2
                onClick={toggleSidebar}
                className="text-sm text-gray-400 mt-2 font-light cursor-pointer hover:text-white"
              >
                {workspace?.title ||
                  workspace?.messages?.[0]?.content ||
                  "Untitled Workspace"}
              </h2>
            </Link>
          ))
        ) : (
          <p className="text-sm text-gray-500 mt-2">No workspaces yet</p>
        )}
      </div>
    </div>
  );
}

export default WorkspaceHistory;
