import Sidebar from "../../components/Sidebar";
import ParticlesBackground from "../../components/ParticlesBackground";
import BorderGlow from "../../components/BorderGlow";

export default function HomeLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="relative flex h-screen max-h-screen w-screen overflow-hidden items-center justify-center bg-[linear-gradient(135deg,#0f172a_0%,#090d16_100%)] p-2 sm:p-4 text-slate-100">
      {/* Dynamic Animated Particles Layer */}
      <ParticlesBackground particleCount={50} particleColor="99, 102, 241" lineColor="56, 189, 248" speed={0.5} />

      <div className="relative z-10 flex h-full max-h-[92vh] w-full max-w-6xl gap-3 flex-col md:flex-row items-stretch justify-center">
        <aside className="relative w-full shrink-0 md:w-[220px] lg:w-[230px] h-full">
          <div className="flex h-full w-full items-stretch justify-center text-center shadow-xl">
            <Sidebar />
          </div>
        </aside>
        
        <main className="relative min-w-0 flex-1 h-full overflow-hidden flex flex-col">
          <BorderGlow
            glowColor="220 80 65"
            backgroundColor="#020617"
            borderRadius={16}
            glowRadius={20}
            glowIntensity={1.1}
            colors={['#6366f1', '#38bdf8', '#a855f7']}
            className="w-full h-full flex flex-col overflow-hidden"
          >
            <div className="relative w-full h-full p-3 sm:p-4 flex flex-col overflow-x-hidden overflow-y-auto no-scrollbar">
              {children}
            </div>
          </BorderGlow>
        </main>
      </div>
    </div>
  );
}