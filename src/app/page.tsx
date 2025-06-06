import CVGenerator from "@/components/CVGenerator";
import PrintOptimizer from "@/components/PrintOptimizer";

export default function Home() {
  return (
    <main className="min-h-screen w-full">
      <PrintOptimizer />
      <div className="container-mobile">
        <CVGenerator />
      </div>
    </main>
  );
}
