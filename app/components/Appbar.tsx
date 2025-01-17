"use client"
import { Button } from "@/components/ui/button"
import { signIn, signOut, useSession } from "next-auth/react"
import Link from "next/link";

export function Navbar() {
    const session = useSession();
    return (
        <header className="container mx-auto px-4 py-6">
            <nav className="flex items-center justify-between">
                <Link href="/" className="text-2xl font-bold text-white">
                    Mukai
                </Link>
                {session.data?.user && <Button className="bg-[#9333ea] hover:bg-[#7e22ce] text-white" onClick={() => signOut()}>
                    Signout
                </Button>}
                {!session.data?.user && <Button className="bg-[#9333ea] hover:bg-[#7e22ce] text-white" onClick={() => signIn()}>
                    Signin
                </Button>}
            </nav>
        </header>
    )
}