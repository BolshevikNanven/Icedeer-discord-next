export default function Layout({children}) {
    return (
        <main className=" bg-gray-50 dark:bg-slate-950 w-full min-h-screen flex flex-row justify-center items-center">
            {children}
        </main>
    )
}