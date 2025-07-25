// app/message/[userId]/page.tsx

interface MessagePageProps {
  params: { userId: string };
}

export default function MessagePage({ params }: MessagePageProps) {
  const { userId } = params;

  return (
    <div className="pl-27 p-6 bg-[#f5e3d2] min-h-screen">
      <h1 className="text-2xl font-semibold mb-4 text-[#5c3b27]">
        Contacting User: {userId}
      </h1>
    </div>
  );
}
