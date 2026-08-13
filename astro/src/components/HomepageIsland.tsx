import PageWrapper from "./PageWrapper";
import Index from "@/pages/Index";

export default function HomepageIsland() {
  return <PageWrapper initialPath="/" Component={Index} />;
}
