import SidebarLayout from "../sidebar";
import DumpsClientPage from "./DumpsClientPage";
import { Suspense } from "react";

export default function DumpsPage() {
  return (
    <SidebarLayout>
      <Suspense fallback={null}>
        <DumpsClientPage />
      </Suspense>
    </SidebarLayout>
  );
}
