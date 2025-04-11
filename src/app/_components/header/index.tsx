"use client";

import { useState, useEffect, useRef } from "react";
import { AccountCircle, Password, Logout } from "@mui/icons-material";

export default function Index() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Handle clicks outside the dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <>
      <div className="h-[60px] border-b-[1px] flex items-center justify-between py-[10px] px-[20px]">
        <div>
          <h2 className="text-3xl font-semibold">
            TFSC<span className="text-xl font-normal"> - Rashan Scheme </span>
          </h2>
        </div>

        <div className="flex items-center justify-center gap-[10px]" ref={dropdownRef}>
          {/* Avatar Button */}
          <div onClick={() => setIsMenuOpen((prev) => !prev)}>
            <div className="w-[45px] h-[45px] rounded-full border-2 border-[#2b3990] overflow-hidden flex items-center justify-center cursor-pointer">
              <img src="/images/logo/irtaza.webp" alt="User Avatar" />
            </div>
          </div>

          <div className="relative">
            <p className="my-0 text-[14px] leading-none">User Name</p>
            <p className="my-0 text-[12px]">User Role</p>

            {/* Dropdown Menu */}
            <div
              className={`absolute top-[40px] right-0 max-w-[500px] bg-[#f9f9f9] py-[15px] px-[20px] rounded-[15px] z-50 text-nowrap shadow-md ${isMenuOpen ? "" : "hidden"
                }`}
            >
              <div>
                <p className="my-0 text-[16px] leading-none">Syed Irtaza Hasnain</p>
                <p className="my-0 text-[12px]">abc@gmail.com</p>
              </div>
              <div className="w-full h-[1px] bg-[#000] opacity-50 my-[15px]"></div>

              <div className="flex flex-col gap-[5px]">
                <div className="flex gap-[10px] items-center rounded-[10px] hover:bg-[#e0e0e0] px-[5px] py-[4px] transition-all cursor-pointer">
                  <AccountCircle />
                  <p className="my-0 text-[14px] leading-none">Edit Profile</p>
                </div>
                <div className="flex gap-[10px] items-center rounded-[10px] hover:bg-[#e0e0e0] px-[5px] py-[4px] transition-all cursor-pointer">
                  <Password />
                  <p className="my-0 text-[14px] leading-none">Change Password</p>
                </div>
                <div className="flex gap-[10px] items-center rounded-[10px] hover:bg-[#e0e0e0] px-[5px] py-[4px] transition-all cursor-pointer">
                  <Logout className="rotate-[180deg]" />
                  <p className="my-0 text-[14px] leading-none">Log Out</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
