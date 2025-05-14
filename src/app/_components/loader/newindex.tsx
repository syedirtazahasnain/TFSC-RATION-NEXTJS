export default function newindex() {
    return (
        <div className="flex flex-col justify-center items-center h-[60vh] bg-white z-50 space-y-4">
            <div className="relative">
                <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
                <div className="absolute inset-0 rounded-full blur-[2px] border-4 border-blue-300 border-t-transparent opacity-50 animate-spin-slow" />
            </div>
            <p className="text-sm text-blue-600 font-medium tracking-wide animate-pulse">
                Loading, please wait...
            </p>
        </div>

    );
}
