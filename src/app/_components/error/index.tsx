type ErrorMessageProps = {
    error?: string;
};

export default function ErrorMessage({ error }: ErrorMessageProps) {
    return (
        <div className="flex justify-center items-center h-screen bg-[#2b3990] bg-opacity-20 px-4 z-50">
            <div className="max-w-md w-full bg-white border border-red-200 shadow-lg rounded-xl p-6 flex flex-col items-center text-center">
                <div className="bg-red-100 text-red-600 rounded-full p-3 mb-4">
                    <svg
                        className="w-6 h-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                    </svg>
                </div>
                <h2 className="text-xl font-semibold text-red-700 mb-2">
                    Oops! Something went wrong
                </h2>
                <p className="text-sm text-gray-700 mb-4">
                    {error || "An unexpected error occurred. Please try again later."}
                </p>
                <div className="flex items-center justify-center gap-[10px]">
                    <button
                        onClick={() => location.reload()}
                        className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
                    >
                        Retry
                    </button>
                    <button
                        onClick={() => window.history.back()}
                        className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
                    >
                        Go Back
                    </button>
                </div>
            </div>
        </div>
    );
}
