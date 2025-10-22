export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    const response = await fetch("http://localhost:8000/api/v1/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      return Response.json({
        success: false,
        message: data.error || data.message || "Login failed"
      }, { status: response.status });
    }

    const formattedResponse = {
      success: true,
      token: data.token,
      user: data.user || data
    };

    const responseHeaders = new Headers();
    responseHeaders.set(
      "Set-Cookie",
      `token=${data.token}; HttpOnly; Path=/; Max-Age=86400; SameSite=Strict`
    );

    return Response.json(formattedResponse, { headers: responseHeaders });
  } catch (error) {
    console.error(error);
    return Response.json({
      success: false,
      message: "Network error occurred"
    }, { status: 500 });
  }
}