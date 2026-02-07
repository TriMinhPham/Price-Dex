import { redirect } from 'next/navigation';

export default async function CardRedirect({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  redirect(`/pokemon/card/${id}`);
}
