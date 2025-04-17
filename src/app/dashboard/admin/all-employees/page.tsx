"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/app/_components/adminsidebar/index";
import Header from "@/app/_components/adminheader/index";
import Breadcrumb from "@/app/_components/ui/Breadcrumb";
import { Dialog } from "@headlessui/react";
import { DriveFileRenameOutline } from "@mui/icons-material";

export default function Page() {
    const [isOpen, setIsOpen] = useState(false);
    const [formData, setFormData] = useState({
        name: "Syed Irtaza Hasnain Shah",
        email: "irtaza1@test.com",
        probation: "yes",
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSave = () => {
        console.log("Updated Data:", formData);
        setIsOpen(false);
    };

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
                    {Array.from({ length: 20 }).map((_, index) => (
                        <div
                            key={index}
                            className="rounded-[20px] overflow-hidden bg-[#f9f9f9] p-[10px] md:p-[15px] xl:p-[20px] relative"
                        >
                            <div className="flex gap-[10px] xl:gap-[20px]">
                                <div>
                                    <div className="w-[60px] h-[60px] rounded-full flex justify-center items-center overflow-hidden">
                                        <img src="/images/logo/irtaza.webp" alt="User Avatar" />
                                    </div>
                                </div>
                                <div>
                                    <p className="text-[14px] my-0 leading-none px-[10px] bg-[#2b3990] rounded-[10px] inline text-[#fff]">
                                        {String(index + 1).padStart(4, "0")}
                                    </p>
                                    <p className="capitalize font-semibold text-[18px] my-1 leading-none">
                                        {formData.name}
                                    </p>
                                    <p className="text-[14px] my-0">{formData.email}</p>
                                </div>
                                <button
                                    onClick={() => setIsOpen(true)}
                                    className="absolute top-[10px] right-[10px] text-gray-700 hover:text-[#00aeef]"
                                >
                                    <DriveFileRenameOutline />
                                </button>
                            </div>
                        </div>
                    ))}

                </div>
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
                                name="probation"
                                value={formData.probation}
                                onChange={handleChange}
                                className="w-full border rounded px-3 py-2"
                            >
                                <option value="yes">Yes</option>
                                <option value="no">No</option>
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
