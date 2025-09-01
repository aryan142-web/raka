"use client";

import { useState, useContext } from "react";
import { ArrowRight, Plus } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMutation } from "convex/react";
import { toast } from "sonner";

import Lookup from "@/app/data/Lookup";
import { MessagesContext } from "@/context/MessagesContext";
import { UserDetailContext } from "@/context/UserDetailContext";
import { api } from "@/convex/_generated/api";
import SignInDialog from "./SignInDialog";

function Hero() {
  const [userInput, setUserInput] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState([]);

  const { messages, setMessages } = useContext(MessagesContext);
  const { userDetail } = useContext(UserDetailContext);

  const createWorkspace = useMutation(api.workspace.createWorkspace);
  const router = useRouter();

  // ✅ Generate Workspace
  const onGenerate = async (input) => {
    try {
      if (!input || input.trim().length === 0) {
        toast.error("Please enter something before generating!");
        return;
      }

      if (!userDetail?._id) {
        setOpenDialog(true);
        return;
      }

      if (userDetail?.token < 10) {
        toast.error("You don't have enough tokens!");
        return;
      }

      // ✅ Preserve user formatting (newlines/spaces)
      const msg = { role: "user", content: input };

      setMessages([...(messages || []), msg]);

      const workspaceId = await createWorkspace({
        messages: [msg],
        userId: userDetail._id,
      });

      router.push(`/workspace/${workspaceId}`);
    } catch (err) {
      console.error("❌ Error creating workspace:", err);
      toast.error("Failed to create workspace.");
    }
  };

  // ✅ File/Folder Upload
  const handleFileUpload = (event) => {
    const files = Array.from(event.target.files || []);
    if (files.length > 0) {
      setUploadedFiles(files);
      toast.success(`Uploaded ${files.length} file(s)`);
    }
  };

  return (
    <div className="min-h-screen w-screen bg-orange-100 text-black overflow-x-hidden">
      {/* Navbar */}
      <header className="flex justify-between items-center px-8 py-4 bg-orange-100">
        <div className="flex items-center">
          <img src="/logo.png" alt="Pi Logo" className="h-10 w-auto" />
        </div>

        <nav className="flex gap-8 text-sm font-medium">
          <Link href="/community">COMMUNITY</Link>
          <Link href="/pricing">PRICING</Link>
          <Link href="/learn">LEARN</Link>
          <Link href="/help-center">HELP CENTER</Link>
        </nav>

        <button
          onClick={() => setOpenDialog(true)}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg"
        >
          SIGN IN
        </button>
      </header>

      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center mt-20 text-center px-4">
        <h1 className="text-4xl md:text-5xl font-bold mt-2">WHAT DO YOU WANT</h1>

        {/* Input Box */}
        <div className="mt-6 w-full max-w-2xl rounded-2xl p-6 relative bg-white shadow">
          <textarea
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            placeholder={Lookup.INPUT_PLACEHOLDER}
            className="outline-none bg-transparent w-full h-40 max-h-58 resize-none text-black placeholder-gray-500 pr-14 pb-12 whitespace-pre-wrap"
          />

          {/* Plus (Upload) - bottom-left */}
          <label
            htmlFor="hero-upload"
            className="absolute bottom-4 left-4 cursor-pointer"
            title="Attach file or folder"
          >
            <input
              id="hero-upload"
              type="file"
              onChange={handleFileUpload}
              className="hidden"
              webkitdirectory="true"
              directory="true"
              multiple
            />
            <Plus className="p-2 h-9 w-9 rounded-md text-black hover:bg-gray-200" />
          </label>

          {/* Arrow Right (Generate) - bottom-right */}
          {userInput && (
            <ArrowRight
              onClick={() => onGenerate(userInput)}
              className="absolute bottom-4 right-4 bg-blue-500 p-2 h-9 w-9 rounded-md cursor-pointer text-white hover:bg-blue-600"
            />
          )}
        </div>

        {/* Uploaded Files Preview */}
        {uploadedFiles.length > 0 && (
          <div className="mt-4 w-full max-w-2xl text-left bg-white p-4 rounded-lg shadow">
            <h3 className="font-semibold mb-2">Uploaded Files:</h3>
            <ul className="text-sm text-gray-700 list-disc pl-5 space-y-1 max-h-40 overflow-y-auto">
              {uploadedFiles.map((file, idx) => (
                <li key={idx}>{file.webkitRelativePath || file.name}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Suggestions */}
        <div className="flex flex-wrap gap-4 mt-8 justify-center text-sm">
          {Lookup?.SUGGESTIONS.map((item, index) => (
            <button
              key={index}
              onClick={() => onGenerate(item)}
              className="px-4 py-2 border rounded-full bg-orange-50 hover:bg-orange-200"
            >
              {item}
            </button>
          ))}
        </div>
      </section>

      {/* Sign In Dialog */}
      <SignInDialog open={openDialog} onOpenChange={setOpenDialog} />
    </div>
  );
}

export default Hero;
