import { Link } from "react-router-dom";
import { ArrowLeft, BookOpen } from "lucide-react";
import { PageHeader } from "../components/ui/PageHeader";
import { PageContainer } from "../components/ui/PageContainer";
import Markdown from "../components/Docs/Markdown";
// docs/integrations.md is the single source for this page and the repo docs.
import guide from "../../docs/integrations.md?raw";

const IntegrationsGuide = () => (
  <PageContainer>
    <PageHeader icon={BookOpen} title="Integration Guide" description="Send changes from any tool to LastGood." />
    <Link to="/integrations" className="inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-white mb-4">
      <ArrowLeft size={14} /> Back to Ingestion Channels
    </Link>
    <div className="bg-[#101413] border border-white/10 rounded-xl p-5 sm:p-8 max-w-4xl">
      <Markdown source={guide} />
    </div>
  </PageContainer>
);

export default IntegrationsGuide;
