import BoostSuccessClient from "@/components/BoostSuccessClient";
import { Suspense } from "react";

export default function BoostSuccessPage() {
  return (
    <Suspense fallback={null}>
      <BoostSuccessClient />
    </Suspense>
  );
}
