import { Link } from "react-router";
import { FiUser, FiLogIn } from "react-icons/fi";

export function Header() {
    const signed = false;
    const loadingAuth = false;

    return (
        <div className="w-full flex items-center justify-center h-16 bg-white drop-shadow mb-4">
            <header className="flex w-full max-w-7xl items-center justify-between px-4 mx-auto">
                <Link to="/">
                    <h1 className="text-blue-500 text-3xl">TourLocal</h1>
                </Link>
                {
                    !loadingAuth && signed && (
                        <Link to="/dashboard">
                            <div className="border-2 rounded-full p-1 border-blue-500">
                                <FiUser size={22} color="#3B82F6"/>
                            </div>
                        </Link>
                    ) 
                }
                {
                    !loadingAuth && !signed && (
                        <Link to="/login">
                            <div className="border-2 rounded-full p-1 border-blue-500">
                                <FiLogIn size={22} color="#3B82F6"/>
                            </div>
                        </Link>
                    ) 
                }
            </header>
        </div>
  )
}
