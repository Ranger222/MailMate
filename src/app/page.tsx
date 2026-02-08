import { Suspense } from "react";
import MailLayout from "@/components/MailLayout";
import MockDataBanner from "@/components/MockDataBanner";

export default function Home() {
  return (
    <>
      <Suspense fallback={null}>
        <MockDataBanner />
      </Suspense>
      <MailLayout />
    </>
  );
}
