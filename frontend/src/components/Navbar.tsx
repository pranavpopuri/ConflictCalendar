const Navbar = () => {
    return (
        <div
            className="w-full h-16 flex items-center justify-between px-6 md:px-8 border-b shadow-sm"
            style={{
                backgroundColor: "oklch(0.97 0.015 220)",
                borderBottomColor: "oklch(0.85 0.03 220)"
            }}
        >
            {/* Left side - Logo and Title */}
            <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-8 h-8 md:w-10 md:h-10">
                    <img
                        src="/calendar.svg"
                        alt="Calendar"
                        className="w-full h-full"
                        style={{ filter: "hue-rotate(200deg) saturate(1.2) brightness(0.8)" }}
                    />
                </div>
                <h1
                    className="text-xl md:text-2xl font-bold tracking-tight"
                    style={{ color: "oklch(0.35 0.12 220)" }}
                >
                    Conflict Calendar
                </h1>
            </div>
        </div>
    )
}

export default Navbar;
