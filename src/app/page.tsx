import { Landing } from "@/components/persona/Landing";
import { SiteHeader } from "@/components/persona/SiteHeader";

export default function Home() {
  return (
    <>
      <SiteHeader variant="marketing" />
      <Landing />
    </>
  );
}
