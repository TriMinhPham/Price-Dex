import { redirect } from 'next/navigation';

export default async function SetRedirect({
  params,
}: {
  params: Promise<{ setId: string }>;
}) {
  const { setId } = await params;
  redirect(`/pokemon/set/${setId}`);
}
