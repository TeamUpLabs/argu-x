export async function POST(request: Request) {
  try {
    const { name, email, password } = await request.json();

    const response = await fetch("http://localhost:8000/api/v1/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password, avatar: "https://randomuser.me/api/portraits/men/2.jpg" }),
    });

    const data = await response.json();

    if (!response.ok) {
      return Response.json({
        success: false,
        message: data.error || data.message || "Signup failed"
      }, { status: response.status });
    }

    return Response.json({
      success: true,
      message: "Signup successful"
    }, { status: 200 });
  } catch (error) {
    console.error(error);
    return Response.json({
      success: false,
      message: "Network error occurred"
    }, { status: 500 });
  }
}