export default function SettingsDetail({
  params,
  searchParams,
}: {
  params: { setting: string };
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  return (
    <div>
      <h4 className="text-lg">{params.setting}</h4>
    </div>
  );
}
