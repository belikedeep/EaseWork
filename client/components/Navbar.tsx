"use client";
import { useRouter } from "next/navigation";
import { useAuth } from "../store/auth";
import { Menubar, MenubarMenu, MenubarTrigger, MenubarContent, MenubarItem } from "@/components/ui/menubar";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";

export default function Navbar() {
    const logout = useAuth((s) => s.logout);
    const router = useRouter();

    const handleLogout = () => {
        logout();
        router.push("/");
    };

    return (
        <nav className="w-full h-14 bg-background border-b flex items-center justify-end px-6 shadow-sm">
            <Menubar className="bg-background border-none shadow-none">
                <MenubarMenu>
                    <MenubarTrigger>
                        <Avatar>
                            <AvatarFallback className="bg-white text-black">U</AvatarFallback>
                        </Avatar>
                    </MenubarTrigger>
                    <MenubarContent align="end">
                        <MenubarItem onClick={handleLogout} className="text-red-600">
                            Logout
                        </MenubarItem>
                    </MenubarContent>
                </MenubarMenu>
            </Menubar>
        </nav>
    );
}