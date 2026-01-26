import SidebarLayout from "./sidebar";

export default function Home() {
  return (
    <SidebarLayout>
      <div className="flex min-h-[calc(100vh-80px)] items-center justify-center px-4">
        <img
          src="/logo-cervi.png"
          alt="Cervi Bazar"
          className="h-56 w-auto sm:h-72"
        />
      </div>
    </SidebarLayout>
  );
}
