import { Button } from "@/components/ui/button"
import { Link } from "react-router-dom";

const Navbar = () => {
    return (
        <div
            className="w-full h-12 flex items-center justify-end px-8 border-b border-gray-200 relative"
            style={{ backgroundColor: "oklch(0.98 0.01 240)" }}
        >
            <Link to='/calendar' className='ml-4'>
                <Button variant="outline" size="sm" className="flex items-center gap-2">
                    <span>View Conflict Calendar</span>
                </Button>
            </Link>
            <Link to="/" className="ml-4">
                <Button variant="outline" size="sm" className="flex items-center gap-2">
                    <span>Home</span>
                </Button>
            </Link>
        </div>
    )
}

export default Navbar;
