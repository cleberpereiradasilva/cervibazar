import SidebarLayout from "./sidebar";

export default function Home() {
  return (
    <SidebarLayout>
      <div className="flex min-h-[calc(100vh-80px)] flex-col items-center justify-center gap-4 px-4 text-center -mt-32">
        <img
          src="/logo-cervi.png"
          alt="Cervi Bazar"
          className="h-56 w-auto sm:h-72"
        />
        <p className="text-base font-semibold text-primary sm:text-lg whitespace-nowrap">
          Atendemos com respeito, acolhimento e compromisso com a missão do Cervi
        </p>
      </div>
    </SidebarLayout>
  );
}
