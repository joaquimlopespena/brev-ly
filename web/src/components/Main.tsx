export default function Main({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex flex-col md:flex-row items-start justify-center bg-dark-gray w-full h-auto min-h-24 p-4 md:space-x-8 space-y-4">
            {children}
        </div>
    )
}