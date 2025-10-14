import DefaultHeader from "@/components/common/DefaultHeader";
import DebateCard from "@/components/debate/DebateCard";
import debates from "../../public/data/debate.json";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <DefaultHeader />
      <main className="flex-1 py-10">
        <div className="max-w-7xl mx-auto grid grid-cols-4 gap-4">
          {debates.map((debate, index) => (
            <DebateCard key={index} debate={debate} />
          ))}
        </div>
      </main>
    </div>
  );
}
