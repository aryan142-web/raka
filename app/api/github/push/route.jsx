import { NextResponse } from "next/server";
import axios from "axios";

export async function POST(req) {
  try {
    const { token, repoName, files } = await req.json();

    if (!token || !repoName || !files) {
      return NextResponse.json(
        { error: "Missing required fields: token, repoName, files" },
        { status: 400 }
      );
    }

    console.log("➡️ Creating repo:", repoName);

    // 1. Create repo
    const repoRes = await axios.post(
      "https://api.github.com/user/repos",
      { name: repoName, private: false },
      { headers: { Authorization: `token ${token}` } }
    );

    const repoUrl = repoRes.data.html_url;
    console.log("✅ Repo created:", repoUrl);

    // 2. Upload files
    for (const file of files) {
      const contentBase64 = Buffer.from(file.content).toString("base64");
      console.log("📄 Uploading file:", file.path);

      await axios.put(
        `https://api.github.com/repos/${repoRes.data.owner.login}/${repoName}/contents/${file.path}`,
        {
          message: `Add ${file.path}`,
          content: contentBase64,
        },
        { headers: { Authorization: `token ${token}` } }
      );
    }

    console.log("✅ All files uploaded");

    return NextResponse.json({ success: true, repoUrl });
  } catch (err) {
    console.error("❌ GitHub push error:", err.response?.data || err.message);
    return NextResponse.json(
      { error: err.response?.data || err.message },
      { status: 500 }
    );
  }
}
