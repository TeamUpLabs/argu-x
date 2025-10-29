"use client";

import DefaultHeader from "@/components/common/DefaultHeader";
import DebateCard from "@/components/debate/DebateCard";
import { Debate } from "@/types/Debate";
import { useEffect, useState } from "react";
import { Loading } from "@/components/common/Loading";

export default function Home() {
  const [debates, setDebates] = useState<Debate[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/debates", {
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({ error: "Unknown error" }));
          console.error("API Error:", errorData);
          return;
        }

        const result = await response.json();
        setDebates(result["debates"]);
      } catch (error) {
        console.error("Failed to fetch debates:", error);
      }
    };
    fetchData();
  }, []);
  
  return (
    <div className="min-h-screen flex flex-col">
      <DefaultHeader fixed />
      <main className="flex-1 py-10">
        {debates && debates.length > 0 ? (
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {debates.map((debate: Debate, index: number) => (
              <DebateCard key={index} debate={debate} />
            ))}
          </div>
        ) : (
          <Loading className="flex items-center justify-center" />
        )}
      </main>
    </div>
  );
}
