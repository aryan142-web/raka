import { NextResponse } from "next/server";

export async function GET() {
  const clientId = process.env.GITHUB_CLIENT_ID;
  if (!clientId) {
    console.error("Missing GITHUB_CLIENT_ID");
    return NextResponse.json({ error: "Missing GITHUB_CLIENT_ID" }, { status: 500 });
  }

  // NOTE: we purposely **omit redirect_uri** so GitHub uses the callback URL registered in the OAuth app.
  const params = new URLSearchParams({
    client_id: clientId,
    scope: "repo", // adjust scopes if you need more
  });

  const githubAuthUrl = `https://github.com/login/oauth/authorize?${params.toString()}`;
  console.log("➡️ GitHub authorize URL:", githubAuthUrl);
  return NextResponse.redirect(githubAuthUrl);
}
