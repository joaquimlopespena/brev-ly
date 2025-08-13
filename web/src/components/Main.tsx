type MainProps = {
    children: React.ReactNode
    align?: 'start' | 'center' | 'end'
}

export default function Main({ children, align = 'start' }: MainProps) {
    return (
        <div
            className={`flex flex-col md:flex-row items-${align} justify-center bg-dark-gray w-full h-auto min-h-24 p-4 md:space-x-8 space-y-4`}
        >
            {children}
        </div>
    )
}
