import GameDetailsPage from "@/app/gamedetails/GameDetailsPage";

interface PageParams {
  params: Promise<{ id: string }>;
}

export default async function Page({ params }: PageParams) {
  const resolvedParams = await params;
  const id = resolvedParams.id;
  return <GameDetailsPage id={id} />;
}
