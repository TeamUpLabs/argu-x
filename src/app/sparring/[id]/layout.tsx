import DefaultHeader from "@/components/common/DefaultHeader";
import { SparringProvider } from "@/provider/SparringProvider";
import { cookies } from "next/headers";
import { Debate } from "@/types/Debate";

async function fetchDebate(debateId: string): Promise<{ debate: Debate | undefined; error: string | undefined }> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return { debate: undefined, error: "인증 토큰이 없습니다." };
    }

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/debates/${debateId}`, {
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      return { debate: undefined, error: "토론 데이터를 불러올 수 없습니다." };
    }

    const data = await response.json();
    return { debate: data, error: undefined };
  } catch (error) {
    console.error("Failed to fetch debate:", error);
    return { debate: undefined, error: "토론 데이터를 불러오는 중 오류가 발생했습니다." };
  }
}

export default async function SparringLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: { id: string };
}>) {
  const { debate, error } = await fetchDebate(params.id);

  return (
    <>
      <DefaultHeader fixed />
      <SparringProvider debate={debate} isLoading={false} error={error}>
        {children}
      </SparringProvider>
    </>
  );
}