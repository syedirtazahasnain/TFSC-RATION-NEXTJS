"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Sidebar from "@/app/_components/adminsidebar/index";
import Header from "@/app/_components/adminheader/index";
import Breadcrumb from "@/app/_components/ui/Breadcrumb";
import { Dialog } from "@headlessui/react";
import { DriveFileRenameOutline } from "@mui/icons-material";
import { toast } from "react-toastify";
import Loader from "@/app/_components/loader/index";

interface User {
    id: number;
    name: string;
    email: string;
    emp_id: string | null;
    d_o_j: string | null;
    location: string | null;
    status: string;
    role: string;
}

interface PaginatedUsers {
    current_page: number;
    data: User[];
    first_page_url: string;
    from: number;
    last_page: number;
    last_page_url: string;
    links: {
        url: string | null;
        label: string;
        active: boolean;
    }[];
    next_page_url: string | null;
    path: string;
    per_page: number;
    prev_page_url: string | null;
    to: number;
    total: number;
}

export default function Page() {
    const [users, setUsers] = useState<PaginatedUsers | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isOpen, setIsOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        status: "",
    });
    const router = useRouter();
    const searchParams = useSearchParams();
    const currentPage = searchParams.get('page') || '1';

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    router.push('/auth/login');
                    return;
                }

                const response = await fetch(
                    `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/admin/users/all?page=${currentPage}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                if (!response.ok) {
                    throw new Error('Failed to fetch users');
                }

                const data = await response.json();
                setUsers(data.data);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to load users');
                toast.error(err instanceof Error ? err.message : 'Failed to load users');
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, [currentPage, router]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleEdit = (user: User) => {
        setSelectedUser(user);
        setFormData({
            name: user.name,
            email: user.email,
            status: user.status,
        });
        setIsOpen(true);
    };

    const handleSave = async () => {
        try {
            if (!selectedUser) return;

            const token = localStorage.getItem('token');
            if (!token) {
                router.push('/auth/login');
                return;
            }

            const response = await fetch(
                `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/admin/users/${selectedUser.id}`,
                {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify(formData),
                }
            );

            if (!response.ok) {
                throw new Error('Failed to update user');
            }

            toast.success('User updated successfully');
            setIsOpen(false);

            // Refresh the user list
            const updatedResponse = await fetch(
                `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/admin/users/all?page=${currentPage}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            const updatedData = await updatedResponse.json();
            setUsers(updatedData.data);
        } catch (err) {
            toast.error(err instanceof Error ? err.message : 'Failed to update user');
        }
    };

    if (loading) {
        return <Loader />;
    }

    if (error) {
        return (
            <div className="min-h-screen flex gap-[20px] px-[20px] xl:px-[30px]">
                <div className="w-[15%] relative">
                    <Sidebar />
                </div>
                <div className="w-full mx-auto space-y-4 p-4">
                    <div>
                        <Header />
                    </div>
                    <div className="px-6 py-6 bg-[#f9f9f9] rounded-[20px] xl:rounded-[25px] text-[#2b3990]">
                        <h1 className="text-2xl font-bold my-0">All Employees</h1>
                        <Breadcrumb items={[{ label: "Dashboard" }, { label: "Employees" }]} />
                    </div>
                    <div className="text-red-500 p-4">{error}</div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex gap-[20px] px-[20px] xl:px-[30px]">
            <div className="w-[15%] relative">
                <Sidebar />
            </div>
            <div className="w-full mx-auto space-y-4 p-4">
                <div>
                    <Header />
                </div>
                <div className="px-6 py-6 bg-[#f9f9f9] rounded-[20px] xl:rounded-[25px] text-[#2b3990]">
                    <h1 className="text-2xl font-bold my-0">All Employees</h1>
                    <Breadcrumb
                        items={[{ label: "Dashboard" }, { label: "Employees" }]}
                    />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-[10px] xl:gap-[15px]">
                    {users?.data.map((user) => (
                        <div
                            key={user.id}
                            className="rounded-[20px] overflow-hidden bg-[#f9f9f9] p-[10px] md:p-[15px] xl:p-[20px] relative"
                        >
                            <div className="flex gap-[10px] xl:gap-[20px]">
                                <div>
                                    <div className="w-[60px] h-[60px] rounded-full flex justify-center items-center overflow-hidden bg-gray-200">
                                        <img 
                                            src="/images/logo/irtaza.webp" 
                                            alt="User Avatar" 
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <p className="text-[14px] my-0 leading-none px-[10px] bg-[#2b3990] rounded-[10px] inline text-[#fff]">
                                        {String(user.id).padStart(4, "0")}
                                    </p>
                                    <p className="capitalize font-semibold text-[18px] my-1 leading-none">
                                        {user.name}
                                    </p>
                                    <p className="text-[14px] my-0">{user.email}</p>
                                    <p className="text-[12px] my-0 capitalize">
                                        Status: {user.status.toLowerCase()}
                                    </p>
                                </div>
                                <button
                                    onClick={() => handleEdit(user)}
                                    className="absolute top-[10px] right-[10px] text-gray-700 hover:text-[#00aeef]"
                                >
                                    <DriveFileRenameOutline />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Pagination - Updated to match your preferred method */}
                {users && users.links.length > 0 && (
                    <div className="flex justify-center gap-2 mt-6">
                        {users.links.map((link, index) => {
                            if (link.url === null) return null;

                            const page = new URL(link.url).searchParams.get('page') || '1';
                            const isActive = link.active;
                            const isPrevious = link.label.includes('Previous');
                            const isNext = link.label.includes('Next');

                            return (
                                <Link
                                    key={index}
                                    href={`/dashboard/admin/all-employees?page=${page}`}
                                    className={`px-4 py-2 rounded-lg border ${
                                        isActive
                                            ? 'bg-[#2b3990] text-white border-blue-500'
                                            : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                                    } ${(isPrevious || isNext) ? 'font-semibold' : ''}`}
                                >
                                    {isPrevious ? '«' : isNext ? '»' : link.label}
                                </Link>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Modal Dialog */}
            <Dialog open={isOpen} onClose={() => setIsOpen(false)} className="relative z-50">
                <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
                <div className="fixed inset-0 flex items-center justify-center p-4">
                    <Dialog.Panel className="w-full max-w-md bg-white rounded-lg p-6 shadow-lg">
                        <Dialog.Title className="text-xl font-semibold mb-4">
                            Edit Employee Info
                        </Dialog.Title>

                        <div className="space-y-4">
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="Full Name"
                                className="w-full border rounded px-3 py-2"
                            />
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="Email"
                                className="w-full border rounded px-3 py-2"
                            />
                            <select
                                name="status"
                                value={formData.status}
                                onChange={handleChange}
                                className="w-full border rounded px-3 py-2"
                            >
                                <option value="Permanent">Permanent</option>
                                <option value="Probation">Probation</option>
                                <option value="Contract">Contract</option>
                                <option value="Internship">Internship</option>
                            </select>
                        </div>

                        <div className="mt-6 flex justify-end gap-2">
                            <button
                                onClick={() => setIsOpen(false)}
                                className="px-4 py-2 text-sm rounded-[10px] hover:text-[#fff] bg-gray-200 hover:bg-gray-800"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSave}
                                className="px-4 py-2 text-sm rounded-[10px] bg-[#2b3990] text-white hover:bg-[#00aeef]"
                            >
                                Save
                            </button>
                        </div>
                    </Dialog.Panel>
                </div>
            </Dialog>
        </div>
    );
}