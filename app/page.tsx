import SidebarLayout from "./sidebar";
import { homeMessageStore } from "@/app/lib/settings/homeMessageStore";

export default async function Home() {
  const settings = await homeMessageStore().get();
  const message =
    settings.message ||
    "Atendemos com respeito, acolhimento e compromisso com a missão do Cervi";
  return (
    <SidebarLayout>
      <div className="flex min-h-[calc(100vh-80px)] flex-col items-center justify-center gap-4 px-4 text-center -mt-32">
        <img
          src="/logo-cervi.png"
          alt="Cervi Bazar"
          className="h-56 w-auto sm:h-72"
        />
        <p className="text-base font-semibold text-primary sm:text-lg whitespace-nowrap">
          {message}
        </p>
      </div>
    </SidebarLayout>
  );
}
