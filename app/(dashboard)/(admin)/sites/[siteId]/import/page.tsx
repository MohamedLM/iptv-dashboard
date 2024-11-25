import { SitePageProps } from "@/types/dashboard";
import ImportFile from "./_components/ImportFile";

export default function Import({ params }: SitePageProps) {
  return (
    <div className="flex flex-col gap-2 h-full justify-between">
      <h3 className="text-xl font-semibold">Import Order Data</h3>
      <ImportFile siteId={params.siteId} />
    </div>
  );
}
