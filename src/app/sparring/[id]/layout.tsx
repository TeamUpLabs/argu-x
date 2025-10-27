import DefaultHeader from "@/components/common/DefaultHeader";
import { SparringProvider } from "@/provider/SparringProvider";
import { cookies } from "next/headers";
import { Metadata } from "next";
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

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const { debate } = await fetchDebate(id);

  if (!debate) {
    return {
      title: "토론을 찾을 수 없습니다 - ArguX",
      description: "요청한 토론을 찾을 수 없습니다.",
    };
  }

  const totalInsights = debate.pros.insights.length + debate.cons.insights.length;

  return {
    title: `${debate.title} - ArguX 토론`,
    description: `${debate.description} | 찬성 ${debate.pros.count}명, 반대 ${debate.cons.count}명 참여 | 총 ${totalInsights}개의 인사이트`,
    keywords: [
      debate.title,
      debate.category,
      "토론",
      "debate",
      "찬반토론",
      debate.pros.title,
      debate.cons.title,
      "ArguX"
    ],
    openGraph: {
      title: `${debate.title} - ArguX 토론`,
      description: `${debate.description} | 찬성 ${debate.pros.count}명, 반대 ${debate.cons.count}명 참여`,
      type: "website",
      images: debate.img ? [
        {
          url: debate.img,
          width: 1200,
          height: 630,
          alt: debate.title,
        },
      ] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: `${debate.title} - ArguX 토론`,
      description: `${debate.description} | 찬성 ${debate.pros.count}명, 반대 ${debate.cons.count}명 참여`,
      images: debate.img ? [debate.img] : undefined,
    },
  };
}

export default async function SparringLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ id: string }>;
}>) {
  const { id } = await params;
  const { debate } = await fetchDebate(id);

  return (
    <>
      <DefaultHeader fixed />
      <SparringProvider initialDebate={debate}>
        {children}
      </SparringProvider>
    </>
  );
}