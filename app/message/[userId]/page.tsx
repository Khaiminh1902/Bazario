import type { Metadata } from "next";

interface PageProps {
  params: {
    userId: string;
  };
}

export function generateMetadata({ params }: PageProps): Metadata {
  return {
    title: `Message ${params.userId}`,
  };
}

export default function MessagePage({ params }: PageProps) {
  const { userId } = params;

  return (
    <div className="pl-27 p-6 bg-[#f5e3d2] min-h-screen">
      <h1 className="text-2xl font-semibold mb-4 text-[#5c3b27]">
        Contacting User: {userId}
      </h1>
    </div>
  );
}
