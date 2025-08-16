type MainProps = {
    children: React.ReactNode
}

export default function Main({ children }: MainProps) {
    return (
        <div className="flex justify-center w-full h-auto min-h-24 p-4">
            <div className="flex flex-col md:flex-row items-start justify-center space-y-6 md:space-y-0 md:space-x-8 w-full max-w-6xl">
                {children}
            </div>
        </div>
    )
}
