export default function Content({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col items-center justify-start bg-gray-200 w-full min-h-screen pt-8">
        {children}
    </div>
  )
}
/*
flex flex-col items-center justify-start min-h-screen bg-gray-200 w-full pt-8
*/