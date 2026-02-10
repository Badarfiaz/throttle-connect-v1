"use client";

import { useAppDispatch, useAppSelector } from "@/app/redux/hooks";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
    MessageCircle,
    CircleHelp,
    Phone,
    User,
    Compass,
    ChevronRight,
    Star,
    LayoutTemplate,
    LogOut,
} from "lucide-react";
import Link from "next/link";
import { logoutUser } from "@/app/redux/features/authSlice";
import { useRouter } from "next/navigation";
import { useCallback } from "react";
import { toast } from "sonner";

const MorePage = () => {
    const { user } = useAppSelector((state) => state.auth);
    const dispatch = useAppDispatch();
    const router = useRouter();

    const handleLogout = useCallback(() => {
        dispatch(logoutUser());
        toast.success("Logout successful", {
            description: "Welcome back to Throttle Connect!",
        });
        router.push("/login");
    }, [dispatch, toast]);

    const menuItems = [
        {
            title: "HELP & SUPPORT",
            items: [
                {
                    label: "Feedback",
                    icon: MessageCircle,
                    href: "/feedback",
                },
                {
                    label: "Help & Support",
                    sublabel: "Help center and legal terms",
                    icon: CircleHelp,
                    href: "/support",
                },
                {
                    label: "Contact Us",
                    icon: Phone,
                    href: "/contact",
                },
            ],
        },
        {
            title: "YOUR ACCOUNT",
            items: [
                {
                    label: "Personal",
                    icon: User,
                    href: "/profilePage",
                },
                {
                    label: "Explore",
                    icon: Compass,
                    href: "/explore",
                },
            ],
        },
    ];

    return (
        <div className="min-h-screen bg-gray-50 pb-24 md:pb-0">
            {/* Header Section */}
            <div className="bg-[#0F4C75] text-white p-6 pt-12 rounded-b-[2rem] shadow-lg relative overflow-hidden">
                {/* Background Pattern (Optional) */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl pointer-events-none" />

                <div className="flex items-center gap-4 relative z-10">
                    <Avatar className="w-16 h-16 border-2 border-white/20 shadow-md">
                        <AvatarImage src={""} />
                        <AvatarFallback className="bg-white/10 text-white text-xl font-bold">
                            {user?.email?.charAt(0).toUpperCase() || "U"}
                        </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                        <h1 className="text-xl font-bold mb-1">
                            {user?.name || user?.email?.split("@")[0] || "User"}
                        </h1>
                        <Link href="/profilePage">
                            <Button
                                variant="outline"
                                className="h-8 text-xs bg-white/10 border-white/20 text-white hover:bg-white/20 hover:text-white"
                            >
                                View Profile
                            </Button>
                        </Link>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-2 gap-4 mt-8 relative z-10">
                    <div className="bg-white/10 backdrop-blur-md rounded-xl p-3 border border-white/10 flex items-center gap-3">
                        <div className="p-2 bg-white/10 rounded-lg">
                            <Star className="w-5 h-5 text-yellow-300 fill-yellow-300" />
                        </div>
                        <div>
                            <div className="text-lg font-bold">0</div>
                            <div className="text-xs text-blue-100">Favorites</div>
                        </div>
                    </div>
                    <div className="bg-white/10 backdrop-blur-md rounded-xl p-3 border border-white/10 flex items-center gap-3">
                        <div className="p-2 bg-white/10 rounded-lg">
                            <LayoutTemplate className="w-5 h-5 text-blue-300" />
                        </div>
                        <div>
                            <div className="text-lg font-bold">Profile</div>
                            <div className="text-xs text-blue-100">Complete</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Menu Sections */}
            <div className="px-4 mt-6 space-y-6">
                {menuItems.map((section) => (
                    <div key={section.title}>
                        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 px-2">
                            {section.title}
                        </h3>
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden divide-y divide-gray-50">
                            {section.items.map((item) => (
                                <Link
                                    key={item.label}
                                    href={item.href}
                                    className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors group"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="p-2 rounded-full bg-blue-50 text-[#0F4C75] group-hover:bg-[#0F4C75] group-hover:text-white transition-colors">
                                            <item.icon className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <div className="font-medium text-gray-900">
                                                {item.label}
                                            </div>
                                            {item.sublabel && (
                                                <div className="text-xs text-gray-500 mt-0.5">
                                                    {item.sublabel}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-[#0F4C75] transition-colors" />
                                </Link>
                            ))}
                        </div>
                    </div>
                ))}

                {/* Logout Section */}
                <div>
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mt-6">
                        <button
                            onClick={handleLogout}
                            className="w-full flex items-center justify-between p-4 hover:bg-red-50 transition-colors group text-left"
                        >
                            <div className="flex items-center gap-4">
                                <div className="p-2 rounded-full bg-red-50 text-red-500 group-hover:bg-red-500 group-hover:text-white transition-colors">
                                    <LogOut className="w-5 h-5" />
                                </div>
                                <div>
                                    <div className="font-medium text-red-600">Log Out</div>
                                </div>
                            </div>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MorePage;
