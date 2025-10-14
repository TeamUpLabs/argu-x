import { Hono } from 'hono';
import { handle } from 'hono/vercel';
export const dynamic = 'force-dynamic';

const app = new Hono().basePath('/api')

app.post('/login', async (c) => {
  try {
    const { email, password } = await c.req.json();

    // 간단한 더미 로그인 로직
    // 실제 애플리케이션에서는 데이터베이스 검증을 해야 합니다
    if (email === 'test@test.com' && password === '1234') {
      const token = 'dummy-token-' + Date.now();

      return c.json({
        success: true,
        message: "Login successful",
        token: token,
        user: {
          email: email,
          name: "테스트 사용자",
          avatar: "https://randomuser.me/api/portraits/men/1.jpg"
        }
      });
    } else {
      return c.json({
        success: false,
        message: "Invalid email or password"
      }, 401);
    }
  } catch (error) {
    console.error('Login error:', error);
    return c.json({
      success: false,
      message: "Login failed"
    }, 500);
  }
});

app.get('/:wild', (c) => {
  const wild = c.req.param('wild')
  return c.json({
    message: `Hello from Hono on Vercel! You're now on /api/${wild}!`
  })
})

export const GET = handle(app)
export const POST = handle(app)