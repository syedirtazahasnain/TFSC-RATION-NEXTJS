"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Header from "@/app/_components/header/index";
import Sidebar from "@/app/_components/sidebar/index";
import Breadcrumb from "@/app/_components/ui/Breadcrumb";
import "@/app/extra.css";
import {
  AddShoppingCart,
  Delete,
  HighlightOff,
  Close,
  ArrowForwardIos,
} from "@mui/icons-material";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const data = [
  {
    name: "Jan",
    uv: 0,
  },
  {
    name: "Feb",
    uv: 500,
  },
  {
    name: "Mar",
    uv: 1000,
  },
  {
    name: "Apr",
    uv: 1580,
  },
  {
    name: "May",
    uv: 1190,
  },
  {
    name: "Jun",
    uv: 950,
  },
  {
    name: "Jul",
    uv: 1490,
  },
  {
    name: "Aug",
    uv: 2090,
  },
  {
    name: "Sep",
    uv: 1090,
  },
  {
    name: "Oct",
    uv: 3490,
  },
  {
    name: "Nov",
    uv: 2490,
  },
  {
    name: "Dec",
    uv: 90,
  },
];

export default function AdminDashboard() {
  return (
    <div className="min-h-screen flex gap-[20px] px-[20px] xl:px-[30px]">
      <div className="w-[15%] relative">
        <Sidebar />
      </div>

      <div className="w-full mx-auto space-y-4 p-4">
        <div>
          <Header />
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-[10px] lg:gap-[15px] xl:gap-[20px]">
          <div className="bg-[#00aeef] bg-opacity-10 rounded-[15px] xl:rounded-[20px] p-[10px] lg:p-[15px] xl:p-[20px]">
            <div className="w-[50px] h-[50px] bg-[#fff] rounded-[15px] flex items-center justify-center">
              <AddShoppingCart />
            </div>
            <div className="mt-[10px] pl-[5px]">
              <p className="my-0 text-[24px] font-semibold">20</p>
              <p className="text-[12px] my-0">Total Users</p>
            </div>
          </div>
          <div className="bg-[#79f123] bg-opacity-10 rounded-[15px] xl:rounded-[20px] p-[10px] lg:p-[15px] xl:p-[20px]">
            <div className="w-[50px] h-[50px] bg-[#fff] rounded-[15px] flex items-center justify-center">
              <AddShoppingCart />
            </div>
            <div className="mt-[10px] pl-[5px]">
              <p className="my-0 text-[24px] font-semibold">15</p>
              <p className="text-[12px] my-0">Total Rashan Count</p>
            </div>
          </div>
          <div className="bg-[#2b3990] bg-opacity-10 rounded-[15px] xl:rounded-[20px] p-[10px] lg:p-[15px] xl:p-[20px]">
            <div className="w-[50px] h-[50px] bg-[#fff] rounded-[15px] flex items-center justify-center">
              <AddShoppingCart />
            </div>
            <div className="mt-[10px] pl-[5px]">
              <p className="my-0 text-[24px] font-semibold">5</p>
              <p className="text-[12px] my-0">
                Employee Order Rashan -{" "}
                <span className="text-[10px]"> This Month</span>
              </p>
            </div>
          </div>
          <div className="bg-[#fbaf2c] bg-opacity-10 rounded-[15px] xl:rounded-[20px] p-[10px] lg:p-[15px] xl:p-[20px]">
            <div className="w-[50px] h-[50px] bg-[#fff] rounded-[15px] flex items-center justify-center">
              <AddShoppingCart />
            </div>
            <div className="mt-[10px] pl-[5px]">
              <p className="my-0 text-[24px] font-semibold">150</p>
              <p className="text-[12px] my-0">
                Employee Take Cash -{" "}
                <span className="text-[10px]"> This Month</span>
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-[10px] lg:gap-[15px] xl:gap-[20px]">
          <div className="bg-[#00aeef] bg-opacity-10 rounded-[15px] xl:rounded-[20px] p-[10px] lg:p-[15px] xl:p-[20px]">
            <div className="">
              <p className="my-0 text-[24px] font-semibold">
                11421310 <span className="text-sm ml-[2px]">Rs</span>
              </p>
              <p className="text-[12px] my-0">
                Company Contribution This Month
              </p>
            </div>
          </div>
          <div className="bg-[#79f123] bg-opacity-10 rounded-[15px] xl:rounded-[20px] p-[10px] lg:p-[15px] xl:p-[20px]">
            <div className="">
              <p className="my-0 text-[24px] font-semibold">
                10421310 <span className="text-sm ml-[2px]">Rs</span>
              </p>
              <p className="text-[12px] my-0">
                Employees Contribution This Month
              </p>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-[10px] lg:gap-[15px] xl:gap-[20px]">
          <div className="bg-[#f9f9f9] rounded-[15px] xl:rounded-[20px] p-[10px] lg:p-[15px] xl:p-[20px]">
            <div className="mb-[20px]">
              <p className="my-0 text-[24px] font-semibold">Rashan Orders</p>
              <p className="text-[12px] my-0">
                Amount of rashan purchased per month.
              </p>
            </div>
            <div className="w-full h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  width={500}
                  height={300}
                  data={data}
                  margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis className="text-xs" dataKey="name" />
                  <YAxis className="text-xs" />
                  <Tooltip />
                  <Line type="monotone" dataKey="uv" stroke="#82ca9d" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="bg-[#f9f9f9] rounded-[15px] xl:rounded-[20px] p-[10px] lg:p-[15px] xl:p-[20px] xl:col-span-2">
            <div className="mb-[20px]">
              <p className="my-0 text-[24px] font-semibold">Recent Order</p>
              <p className="text-[12px] my-0">
                Amount of rashan purchased per month.
              </p>
            </div>
            <div className="bg-[#fff] p-[10px] rounded-[15px] xl:rounded-[20px]">
              <table className="w-full">
                <thead className="">
                  <tr className="">
                    <th className="py-2 px-2 text-left rounded-l-xl bg-[#e0e0e0]">
                      <p className="text-xs font-semibold">Order No.</p>
                    </th>
                    <th className="py-2 px-2 text-left bg-[#e0e0e0]">
                      <p className="text-xs font-semibold">Emp Id</p>
                    </th>
                    <th className="py-2 px-2 text-left bg-[#e0e0e0]">
                      <p className="text-xs font-semibold">Name</p>
                    </th>
                    <th className="py-2 px-2 text-left bg-[#e0e0e0]">
                      <p className="text-xs font-semibold">
                        Employee Contribution
                      </p>
                    </th>
                    <th className="py-2 px-2 text-left bg-[#e0e0e0]">
                      <p className="text-xs font-semibold">
                        Company Contribution
                      </p>
                    </th>
                    <th className="py-2 px-2 text-left rounded-r-xl bg-[#e0e0e0]">
                      <p className="text-xs font-semibold">Status</p>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {[1, 2, 3, 4, 5].map((item) => (
                    <tr key={item} className="border-b">
                      {" "}
                      {/* Added key prop here */}
                      <td className="py-2 px-5">
                        <p className="font-semibold text-md">{1000 + item}</p>
                      </td>
                      <td className="py-2 px-2">
                        <p className="text-md">0179</p>
                      </td>
                      <td className="py-2 px-2">
                        <p className="text-md">Gohar Ali Jafri</p>
                      </td>
                      <td className="py-2 px-2">
                        <p className="text-md">
                          14470 <span className="text-sm ml-[2px]">Rs</span>
                        </p>
                      </td>
                      <td className="py-2 px-2">
                        <p className="text-md">
                          10000 <span className="text-sm ml-[2px]">Rs</span>
                        </p>
                      </td>
                      <td className="flex items-center mt-[6px] ml-[10px]">
                        <div className="px-4 py-1 text-xs bg-orange-100 rounded-[10px]">
                          <p className="my-0 text-orange-800 font-semibold">
                            Pending
                          </p>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// export default function AdminDashboard() {
//     return (
//         <div>Admin</div>
//     );
// }
