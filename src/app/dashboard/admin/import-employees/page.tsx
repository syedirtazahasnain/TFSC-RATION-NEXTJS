"use client";

import { useState } from "react";
import Sidebar from "@/app/_components/adminsidebar/index";
import Header from "@/app/_components/adminheader/index";
import Breadcrumb from "@/app/_components/ui/Breadcrumb";
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';

export default function Page() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewContent, setPreviewContent] = useState<string>("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setSelectedFile(file || null);
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
          <h1 className="text-2xl font-bold my-0">Import Employees</h1>
          <Breadcrumb
            items={[{ label: "Dashboard" }, { label: "Import" }]}
          />
        </div>

        <div className="flex w-full bg-[#f9f9f9] rounded-[20px] xl:rounded-[25px]">
          <div className="w-full xl:w-1/2 rounded-[20px] p-[10px] md:p-[20px] xl:p-[30px]">
            <form>
              <div className="mb-4">
                <label
                  htmlFor="file_upload"
                  className="block text-sm font-medium mb-2"
                >
                  Upload File
                </label>
                <input
                  type="file"
                  id="file_upload"
                  name="file_upload"
                  accept=".csv, .txt, .xlsx"
                  onChange={handleFileChange}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>

              {selectedFile && (
                <div className="my-4 flex items-center gap-3 p-3 bg-gray-100 border rounded-lg">
                  <span className="text-[#2b3990]">
                    <InsertDriveFileIcon fontSize="large" />
                  </span>
                  <div className="">
                    <p className="font-medium text-[#2b3990] text-sm my-0">{selectedFile.name}</p>
                    <p className="text-gray-600 text-[12px] my-0">{selectedFile.type || "Unknown type"}</p>
                  </div>
                </div>
              )}


              <button
                type="submit"
                className="w-full bg-[#2b3990] text-white py-2 rounded-lg hover:bg-[#00aeef] transition"
              >
                Import
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
