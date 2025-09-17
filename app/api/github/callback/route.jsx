import { NextResponse } from "next/server";
import axios from "axios";

export async function GET(req) {
  const url = new URL(req.url);
  const code = url.searchParams.get("code");
  const error = url.searchParams.get("error");

  if (error) {
    console.error("GitHub returned error:", error);
    return NextResponse.json({ error: `GitHub error: ${error}` }, { status: 400 });
  }

  if (!code) {
    console.error("No code in callback");
    return NextResponse.json({ error: "No code returned from GitHub" }, { status: 400 });
  }

  try {
    const tokenRes = await axios.post(
      "https://github.com/login/oauth/access_token",
      {
        client_id: process.env.GITHUB_CLIENT_ID,
        client_secret: process.env.GITHUB_CLIENT_SECRET,
        code,
        // do not pass redirect_uri here unless you used it in the authorize request
      },
      { headers: { Accept: "application/json" } }
    );

    console.log("🔑 token response:", tokenRes.data);
    const accessToken = tokenRes.data.access_token;
    if (!accessToken) throw new Error("No access token returned from GitHub");

    // Redirect back to your frontend with the token (or save server-side to DB)
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_APP_URL}/workspace?github_token=${accessToken}`
    );
  } catch (err) {
    console.error("Error exchanging code:", err.response?.data || err.message);
    return NextResponse.json({ error: err.response?.data || err.message }, { status: 500 });
  }
}
