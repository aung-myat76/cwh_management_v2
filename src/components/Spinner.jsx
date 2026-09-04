export const Spinner = ({ size = "md", color = "border-white" }) => {
    // Define size variants
    const sizeClasses = {
        sm: "w-4 h-4 border-2",
        md: "w-5 h-5 border-2",
        lg: "w-6 h-6 border-3"
    };

    return (
        <div
            className={`rounded-full animate-spin border-t-transparent ${color} ${
                sizeClasses[size] || sizeClasses.md
            }`}
            role="status"
            aria-label="loading"
        />
    );
};
