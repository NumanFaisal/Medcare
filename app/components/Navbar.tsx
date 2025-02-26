'use client'

import { useSession, signOut } from "next-auth/react";
import { useState } from "react";

function Navbar() {

    const [isOpen, setIsOpen] = useState(false);

    const toggleNav = () => {
        setIsOpen(!isOpen);
    }

    return (
        <div>
            <nav>
                <button onClick={toggleNav}  className={'space-y-2'}>
                    <span className={`block h-1 w-6 bg-white ${isOpen ? 'rotate-45 traslate-y-2' : ''}`} ></span>
                    <span className={`block h-1 w-6 bg-white ${isOpen ? 'rotate-45 traslate-y-2' : ''}`} ></span>
                    <span className={`block h-1 w-6 bg-white ${isOpen ? 'rotate-45 traslate-y-2' : ''}`} ></span>
                </button>
            </nav>
        </div>
    )
}


export default Navbar;