'use client';

import ProductFormPage from '@/app/_components/ProductFormPage';
import Header from "@/app/_components/adminheader/index";
import Sidebar from "@/app/_components/adminsidebar/index";
import Breadcrumb from "@/app/_components/ui/Breadcrumb";

export default function AddProductPage() {
  return (
    <div className="min-h-screen flex gap-[20px] px-[20px] xl:px-[30px]">
      <div className="w-[15%] relative">
        <Sidebar />
      </div>
      <div className="w-full mx-auto space-y-4 p-4">
        <div><Header /></div>
        <div className="px-6 py-6 bg-[#f9f9f9] rounded-[20px] xl:rounded-[25px] text-[#2b3990]">
          <h1 className="text-2xl font-bold my-0">Add New Product</h1>
          <Breadcrumb
            items={[{ label: "Dashboard" }, { label: "New Product" }]}
          />
        </div>

        <div className="overflow-x-auto mb-8">
          <div className='mb-[15px] px-[20px]'>
            <p className='text-lg font-semibold my-0'>Product Details</p>
          </div>
          <div className="px-[20px]">
            <ProductFormPage />
          </div>
        </div>
      </div>
    </div>
  );
}