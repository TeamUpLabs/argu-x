"use client";

import DefaultHeader from "@/components/common/DefaultHeader";
import DebateCard from "@/components/debate/DebateCard";
import { Debate } from "@/types/Debate";
import { Loading } from "@/components/common/Loading";
import { useEffect, useState } from "react";
import { use } from 'react';

function CategoryContent({ category }: { category: string }) {
  const [debates, setDebates] = useState<Debate[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`/api/debates?category=${category}`, {
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({ error: "Failed to fetch debates" }));
          throw new Error(errorData.error || "Failed to fetch debates");
        }

        const result = await response.json();
        // Ensure we always set an array, even if the response is null/undefined
        setDebates(Array.isArray(result?.debates) ? result.debates : []);
        setError(null);
      } catch (error_) {
        console.error("Failed to fetch debates:", error_);
        setError(error_ instanceof Error ? error_.message : "An unknown error occurred");
        setDebates([]); // Set to empty array on error
      }
    };
    
    fetchData();
  }, [category]);

  return (
    <div className="min-h-screen flex flex-col">
      <DefaultHeader fixed />
      <main className="flex-1 py-10">
        {(() => {
          if (error) {
            return (
              <div className="text-center text-red-500">
                Error: {error}
              </div>
            );
          }
          if (debates === null) {
            return <Loading className="flex items-center justify-center" />;
          }
          if (debates.length === 0) {
            return (
              <div className="text-center text-gray-500">
                No debates found in this category.
              </div>
            );
          }
          return (
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {debates.map((debate: Debate, index: number) => (
                <DebateCard key={index} debate={debate} />
              ))}
            </div>
          );
        })()}
      </main>
    </div>
  );
}

export default function CategoryPage({ params }: { params: Promise<{ category: string }> }) {
  const { category } = use(params);
  return <CategoryContent category={category} />;
}