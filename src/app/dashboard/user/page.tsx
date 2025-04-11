"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Header from "@/app/_components/header/index";
import Sidebar from "@/app/_components/sidebar/index";
import Breadcrumb from "@/app/_components/ui/Breadcrumb";
import "@/app/extra.css";
import { AddShoppingCart, Delete, HighlightOff, Close, ArrowForwardIos } from "@mui/icons-material";

interface UserData {
  id: number;
  name: string;
  email: string;
  my_role: string;
  role?: string;
  created_at: string;
  updated_at: string;
}

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';


const data = [
  {
    name: 'Jan',
    uv: 0,
  },
  {
    name: 'Feb',
    uv: 500,
  },
  {
    name: 'Mar',
    uv: 1000,
  },
  {
    name: 'Apr',
    uv: 1580,
  },
  {
    name: 'May',
    uv: 1190,
  },
  {
    name: 'Jun',
    uv: 950,
  },
  {
    name: 'Jul',
    uv: 1490,
  },
  {
    name: 'Aug',
    uv: 2090,
  },
  {
    name: 'Sep',
    uv: 1090,
  },
  {
    name: 'Oct',
    uv: 3490,
  },
  {
    name: 'Nov',
    uv: 2490,
  },
  {
    name: 'Dec',
    uv: 90,
  },
];

export default function UserDashboard({ my_role }: UserData) {
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          router.push("/auth/login");
          return;
        }

        const response = await fetch("http://127.0.0.1:8000/api/user-details", {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        });

        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.message || "Failed to fetch user details");
        }

        const data = await response.json();
        setUser(data.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchUserDetails();
  }, [router]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-20">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        {error}
      </div>
    );
  }

  if (!user) {
    return <div className="text-gray-500">No user data available</div>;
  }

  return (
    <div className="min-h-screen flex gap-[20px] px-[20px] xl:px-[30px]">
      <div className="w-[15%] relative">
        <Sidebar />
      </div>

      <div className="w-full mx-auto space-y-4 p-4">
        <div><Header /></div>

        <div className="p-5 mb-6 bg-[#f9f9f9] rounded-2xl lg:p-6">
          <div>
            <div className="flex flex-col items-center w-full gap-6 xl:flex-row">
              <div className="w-20 h-20 overflow-hidden border border-gray-200 rounded-full dark:border-gray-800">
                <img src="/images/logo/irtaza.webp" alt="user" />
              </div>
              <div className="order-3 xl:order-2">
                <h4 className="mb-2 text-lg font-semibold text-center text-gray-800 dark:text-white/90 xl:text-left">
                  {user.name}
                </h4>
                <div className="flex flex-col items-center gap-1 text-center xl:flex-row xl:gap-3 xl:text-left">
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {user.email}
                  </p>
                  <div className="hidden h-3.5 w-px bg-gray-300 dark:bg-gray-700 xl:block"></div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 capitalize font-semibold">
                    {user.my_role}
                  </p>
                </div>
              </div>
              <div className="flex items-center order-2 gap-2 grow xl:order-3 xl:justify-end">
                <button className="flex h-11 w-11 items-center justify-center gap-2 rounded-full border border-gray-300 bg-white text-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200">
                  <svg
                    className="fill-current"
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M11.6666 11.2503H13.7499L14.5833 7.91699H11.6666V6.25033C11.6666 5.39251 11.6666 4.58366 13.3333 4.58366H14.5833V1.78374C14.3118 1.7477 13.2858 1.66699 12.2023 1.66699C9.94025 1.66699 8.33325 3.04771 8.33325 5.58342V7.91699H5.83325V11.2503H8.33325V18.3337H11.6666V11.2503Z"
                      fill=""
                    />
                  </svg>
                </button>

                <button className="flex h-11 w-11 items-center justify-center gap-2 rounded-full border border-gray-300 bg-white text-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200">
                  <svg
                    className="fill-current"
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M15.1708 1.875H17.9274L11.9049 8.75833L18.9899 18.125H13.4424L9.09742 12.4442L4.12578 18.125H1.36745L7.80912 10.7625L1.01245 1.875H6.70078L10.6283 7.0675L15.1708 1.875ZM14.2033 16.475H15.7308L5.87078 3.43833H4.23162L14.2033 16.475Z"
                      fill=""
                    />
                  </svg>
                </button>

                <button className="flex h-11 w-11 items-center justify-center gap-2 rounded-full border border-gray-300 bg-white text-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200">
                  <svg
                    className="fill-current"
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M5.78381 4.16645C5.78351 4.84504 5.37181 5.45569 4.74286 5.71045C4.11391 5.96521 3.39331 5.81321 2.92083 5.32613C2.44836 4.83904 2.31837 4.11413 2.59216 3.49323C2.86596 2.87233 3.48886 2.47942 4.16715 2.49978C5.06804 2.52682 5.78422 3.26515 5.78381 4.16645ZM5.83381 7.06645H2.50048V17.4998H5.83381V7.06645ZM11.1005 7.06645H7.78381V17.4998H11.0672V12.0248C11.0672 8.97475 15.0422 8.69142 15.0422 12.0248V17.4998H18.3338V10.8914C18.3338 5.74978 12.4505 5.94145 11.0672 8.46642L11.1005 7.06645Z"
                      fill=""
                    />
                  </svg>
                </button>

                <button className="flex h-11 w-11 items-center justify-center gap-2 rounded-full border border-gray-300 bg-white text-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200">
                  <svg
                    className="fill-current"
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M10.8567 1.66699C11.7946 1.66854 12.2698 1.67351 12.6805 1.68573L12.8422 1.69102C13.0291 1.69766 13.2134 1.70599 13.4357 1.71641C14.3224 1.75738 14.9273 1.89766 15.4586 2.10391C16.0078 2.31572 16.4717 2.60183 16.9349 3.06503C17.3974 3.52822 17.6836 3.99349 17.8961 4.54141C18.1016 5.07197 18.2419 5.67753 18.2836 6.56433C18.2935 6.78655 18.3015 6.97088 18.3081 7.15775L18.3133 7.31949C18.3255 7.73011 18.3311 8.20543 18.3328 9.1433L18.3335 9.76463C18.3336 9.84055 18.3336 9.91888 18.3336 9.99972L18.3335 10.2348L18.333 10.8562C18.3314 11.794 18.3265 12.2694 18.3142 12.68L18.3089 12.8417C18.3023 13.0286 18.294 13.213 18.2836 13.4351C18.2426 14.322 18.1016 14.9268 17.8961 15.458C17.6842 16.0074 17.3974 16.4713 16.9349 16.9345C16.4717 17.397 16.0057 17.6831 15.4586 17.8955C14.9273 18.1011 14.3224 18.2414 13.4357 18.2831C13.2134 18.293 13.0291 18.3011 12.8422 18.3076L12.6805 18.3128C12.2698 18.3251 11.7946 18.3306 10.8567 18.3324L10.2353 18.333C10.1594 18.333 10.0811 18.333 10.0002 18.333H9.76516L9.14375 18.3325C8.20591 18.331 7.7306 18.326 7.31997 18.3137L7.15824 18.3085C6.97136 18.3018 6.78703 18.2935 6.56481 18.2831C5.67801 18.2421 5.07384 18.1011 4.5419 17.8955C3.99328 17.6838 3.5287 17.397 3.06551 16.9345C2.60231 16.4713 2.3169 16.0053 2.1044 15.458C1.89815 14.9268 1.75856 14.322 1.7169 13.4351C1.707 13.213 1.69892 13.0286 1.69238 12.8417L1.68714 12.68C1.67495 12.2694 1.66939 11.794 1.66759 10.8562L1.66748 9.1433C1.66903 8.20543 1.67399 7.73011 1.68621 7.31949L1.69151 7.15775C1.69815 6.97088 1.70648 6.78655 1.7169 6.56433C1.75786 5.67683 1.89815 5.07266 2.1044 4.54141C2.3162 3.9928 2.60231 3.52822 3.06551 3.06503C3.5287 2.60183 3.99398 2.31641 4.5419 2.10391C5.07315 1.89766 5.67731 1.75808 6.56481 1.71641C6.78703 1.70652 6.97136 1.69844 7.15824 1.6919L7.31997 1.68666C7.7306 1.67446 8.20591 1.6689 9.14375 1.6671L10.8567 1.66699ZM10.0002 5.83308C7.69781 5.83308 5.83356 7.69935 5.83356 9.99972C5.83356 12.3021 7.69984 14.1664 10.0002 14.1664C12.3027 14.1664 14.1669 12.3001 14.1669 9.99972C14.1669 7.69732 12.3006 5.83308 10.0002 5.83308ZM10.0002 7.49974C11.381 7.49974 12.5002 8.61863 12.5002 9.99972C12.5002 11.3805 11.3813 12.4997 10.0002 12.4997C8.6195 12.4997 7.50023 11.3809 7.50023 9.99972C7.50023 8.61897 8.61908 7.49974 10.0002 7.49974ZM14.3752 4.58308C13.8008 4.58308 13.3336 5.04967 13.3336 5.62403C13.3336 6.19841 13.8002 6.66572 14.3752 6.66572C14.9496 6.66572 15.4169 6.19913 15.4169 5.62403C15.4169 5.04967 14.9488 4.58236 14.3752 4.58308Z"
                      fill=""
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-[10px] lg:gap-[15px] xl:gap-[20px]">
          <div className="bg-[#00aeef] bg-opacity-10 rounded-[15px] xl:rounded-[20px] p-[10px] lg:p-[15px] xl:p-[20px]">
            <div className="w-[50px] h-[50px] bg-[#fff] rounded-[15px] flex items-center justify-center">
              <AddShoppingCart />
            </div>
            <div className="mt-[10px] pl-[5px]">
              <p className="my-0 text-[24px] font-semibold">
                20
              </p>
              <p className="text-[12px] my-0">Total Months</p>
            </div>
          </div>
          <div className="bg-[#2b3990] bg-opacity-10 rounded-[15px] xl:rounded-[20px] p-[10px] lg:p-[15px] xl:p-[20px]">
            <div className="w-[50px] h-[50px] bg-[#fff] rounded-[15px] flex items-center justify-center">
              <AddShoppingCart />
            </div>
            <div className="mt-[10px] pl-[5px]">
              <p className="my-0 text-[24px] font-semibold">
                5
              </p>
              <p className="text-[12px] my-0">Total Cash Count</p>
            </div>
          </div>
          <div className="bg-[#79f123] bg-opacity-10 rounded-[15px] xl:rounded-[20px] p-[10px] lg:p-[15px] xl:p-[20px]">
            <div className="w-[50px] h-[50px] bg-[#fff] rounded-[15px] flex items-center justify-center">
              <AddShoppingCart />
            </div>
            <div className="mt-[10px] pl-[5px]">
              <p className="my-0 text-[24px] font-semibold">
                15
              </p>
              <p className="text-[12px] my-0">Total Rashan Count</p>
            </div>
          </div>
          <div className="bg-[#fbaf2c] bg-opacity-10 rounded-[15px] xl:rounded-[20px] p-[10px] lg:p-[15px] xl:p-[20px]">
            <div className="w-[50px] h-[50px] bg-[#fff] rounded-[15px] flex items-center justify-center">
              <AddShoppingCart />
            </div>
            <div className="mt-[10px] pl-[5px]">
              <p className="my-0 text-[24px] font-semibold">
                Rashan
              </p>
              <p className="text-[12px] my-0">Current Month</p>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-[10px] lg:gap-[15px] xl:gap-[20px]">
          <div className="bg-[#f9f9f9] rounded-[15px] xl:rounded-[20px] p-[10px] lg:p-[15px] xl:p-[20px]">
            <div className="mb-[20px]">
              <p className="my-0 text-[24px] font-semibold">
                Rashan Details
              </p>
              <p className="text-[12px] my-0">Amount of rashan purchased per month.</p>
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
              <p className="my-0 text-[24px] font-semibold">
                Latest Month
              </p>
              <p className="text-[12px] my-0">Amount of rashan purchased per month.</p>
            </div>
            <div className="bg-[#fff] p-[10px] rounded-[15px] xl:rounded-[20px]">
              <table className="w-full">
                <thead className="">
                  <tr className="">
                    <th className="py-2 px-2 text-left rounded-l-xl bg-[#e0e0e0]">
                      <p className="text-xs font-semibold">
                        Sr No.
                      </p>
                    </th>
                    <th className="py-2 px-2 text-left bg-[#e0e0e0]">
                      <p className="text-xs font-semibold">
                        Month
                      </p>
                    </th>
                    <th className="py-2 px-2 text-left bg-[#e0e0e0]">
                      <p className="text-xs font-semibold">
                        Rashan / Cash
                      </p>
                    </th>
                    <th className="py-2 px-2 text-left bg-[#e0e0e0]">
                      <p className="text-xs font-semibold">
                        Amount
                      </p>
                    </th>
                    <th className="py-2 px-2 text-left rounded-r-xl bg-[#e0e0e0]">
                      <p className="text-xs font-semibold">
                        Amount
                      </p>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b">
                    <td className="py-2 px-5">
                      <p className="font-semibold text-md">
                        1
                      </p>
                    </td>
                    <td className="py-2 px-2">
                      <p className="text-md">
                        January
                      </p>
                    </td>
                    <td className="flex items-center mt-[5px] ml-[10px]">
                      <div className="px-4 py-1 text-xs bg-green-100 rounded-[10px]">
                        <p className="my-0 text-green-800 font-semibold">
                          Yes
                        </p>
                      </div>
                    </td>
                    <td className="py-2 px-2">
                      <p className="text-md">
                        24600 <span className="text-sm ml-[2px]">Rs</span>
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
                  <tr className="border-b">
                    <td className="py-2 px-5">
                      <p className="font-semibold text-md">
                        2
                      </p>
                    </td>
                    <td className="py-2 px-2">
                      <p className="text-md">
                        Feb
                      </p>
                    </td>
                    <td className="flex items-center mt-[5px] ml-[10px]">
                      <div className="px-4 py-1 text-xs bg-orange-100 rounded-[10px]">
                        <p className="my-0 text-orange-800 font-semibold">
                          No
                        </p>
                      </div>
                    </td>
                    <td className="py-2 px-2">
                      <p className="text-md">
                        7000 <span className="text-sm ml-[2px]">Rs</span>
                      </p>
                    </td>
                    <td className="flex items-center mt-[6px] ml-[10px]">
                      <div className="px-4 py-1 text-xs bg-green-100 rounded-[10px]">
                        <p className="my-0 text-green-800 font-semibold">
                          Received
                        </p>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}