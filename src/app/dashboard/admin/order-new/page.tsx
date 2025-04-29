'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Order } from "@/types";
import { toast } from "react-toastify";
import Header from "@/app/_components/adminheader/index";
import ErrorMessage from "@/app/_components/error/index";
import Loader from "@/app/_components/loader/index";
import { Input, DateRangePicker } from "@heroui/react";
import Sidebar from "@/app/_components/adminsidebar/index";
import Breadcrumb from "@/app/_components/ui/Breadcrumb";

interface PaginatedOrders {
  data: Order[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
  links: {
    url: string | null;
    label: string;
    active: boolean;
  }[];
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<PaginatedOrders | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [searchEmpId, setSearchEmpId] = useState('');
  const [dateRange, setDateRange] = useState<{start?: Date, end?: Date}>({});
  const [isSearching, setIsSearching] = useState(false);
  
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentPage = searchParams.get('page') || '1';

  const fetchOrders = async (page = currentPage, empIds: string[] = [], startDate = '', endDate = '') => {
    try {
      setIsSearching(true);
      setLoading(true);
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/auth/login');
        return;
      }

      const params = new URLSearchParams();
      params.append('page', page);
      
      if (empIds.length > 0) {
        params.append('emp_id', empIds.join(','));
      }
      if (startDate) {
        params.append('start_date', startDate);
      }
      if (endDate) {
        params.append('end_date', endDate);
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/admin/orders/all?${params.toString()}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch orders');
      }

      setOrders(data.data);
      setSelectedOrder(data.data?.data?.[0] ?? null);
      
      if (data.data?.data?.length === 0) {
        toast.info(data.message || 'No orders found matching your criteria');
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to load orders';
      toast.error(msg);
      setError(msg);
    } finally {
      setLoading(false);
      setIsSearching(false);
    }
  };

  const handleSearch = () => {
    const formatDate = (date) => {
      if (!date) return '';
      const d = new Date(date);
      const pad = (n) => n.toString().padStart(2, '0');
      return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
    };
    
    const startDate = formatDate(dateRange.start);
    const endDate = formatDate(dateRange.end);
    
    const empIds = searchEmpId
      .split(/[, ]+/)
      .filter(id => id.trim() !== '')
      .map(id => id.trim());

    fetchOrders('1', empIds, startDate, endDate);
  };

  const clearFilters = () => {
    setSearchEmpId('');
    setDateRange({});
    fetchOrders();
  };

  useEffect(() => {
    fetchOrders();
  }, [currentPage, router]);

  return (
    <div className="min-h-screen flex gap-[20px] px-[20px] xl:px-[30px]">
      <div className="w-[15%] relative">
        <Sidebar />
      </div>
      <div className="w-full mx-auto space-y-4 p-4">
        <Header />
        <div className="px-6 py-6 bg-[#f9f9f9] rounded-[20px] xl:rounded-[25px] text-[#2b3990]">
          <h1 className="text-2xl font-bold">All Orders Details</h1>
          <Breadcrumb items={[{ label: "Dashboard" }, { label: "All Orders" }]} />
        </div>

        <div>
          <div className='flex gap-2'>
            <Input 
              type="text" 
              placeholder="Search Emp ID (comma separated)..." 
              className="max-w-xs"
              value={searchEmpId}
              onChange={(e) => setSearchEmpId(e.target.value)}
              classNames={{
                inputWrapper: "bg-white border-2"
              }} 
            />
            <DateRangePicker
              className="max-w-xs"
              value={dateRange}
              onChange={setDateRange}
              classNames={{
                inputWrapper: "bg-white border-2"
              }} 
              visibleMonths={2} 
            />
            <div className='shadow-sm border-[2px] rounded-[10px] flex items-center justify-center hover:bg-[#2b3990] hover:text-[#fff] transition-all duration-300 ease-in-out hover:border-[#2b3990]'>
              <button 
                className="text-xs uppercase px-4 rounded-[10px] flex items-center gap-2"
                onClick={handleSearch}
                disabled={isSearching}
              >
                {isSearching ? 'Searching...' : 'Search'}
              </button>
            </div>
          </div>
          <div className='flex gap-2 mt-2'>
            <button 
              className="text-xs text-gray-600 hover:text-gray-800"
              onClick={clearFilters}
            >
              Clear Filters
            </button>
          </div>
        </div>

        {loading ? (
          <Loader />
        ) : error ? (
          <ErrorMessage error={error} />
        ) : !orders?.data.length ? (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <div className="text-gray-500 text-lg mb-4">
              No orders found matching your criteria
            </div>
            <button
              onClick={clearFilters}
              className="px-4 py-2 bg-[#2b3990] text-white rounded-lg hover:bg-[#00aeef] transition"
            >
              Clear Search Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-[10px] md:gap-[15px] lg:gap-[20px] mb-8 items-start">
            {/* Left: Order List */}
            <div className='bg-[#f9f9f9] rounded-[15px] xl:rounded-[20px] p-4 grid grid-cols-1 gap-[10px]'>
              {orders.data.map((order) => (
                <div
                  key={order.id}
                  onClick={() => setSelectedOrder(order)}
                  className={`cursor-pointer bg-[#fff] p-[8px] rounded-[15px] flex items-center gap-[10px] hover:bg-blue-50 ${selectedOrder?.id === order.id ? 'border border-blue-500' : ''}`}
                >
                  <div className='w-[45px] h-[45px] bg-[#2b3990] rounded-full flex items-center justify-center overflow-hidden'>
                    <img src="/images/items/arial.png" alt="Item" />
                  </div>
                  <div>
                    <p className='text-xs my-0 uppercase leading-none'>{order.user.emp_id}</p>
                    <p className='font-semibold text-[15px] my-0 leading-none'>Gohar Ali</p>
                    <p className='text-xs my-0 uppercase'>{order.order_number}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Right: Invoice Viewer */}
            <div className='bg-[#f9f9f9] rounded-[15px] xl:rounded-[20px] p-4 xl:p-8 md:col-span-2 lg:col-span-4'>
              {selectedOrder ? (
                <>
                  <div className='flex items-center justify-between pb-2'>
                    <p className='my-0 font-semibold text-lg'>Invoice</p>
                    <p className='my-0 text-lg'>EMP ID# {selectedOrder.user.emp_id}</p>
                  </div>
                  <div className='grid grid-cols-1 md:grid-cols-2 gap-[10px] border-[1px] p-4 mb-4 items-start rounded-[15px]'>
                    <div className='grid grid-cols-1 gap-[10px] md:border-r-[1px]'>
                      <div>
                        <p className='my-0 text-xs'>Name</p>
                        <p className='my-0 text-lg font-semibold'>Gohar Ali</p>
                      </div>
                      <div>
                        <p className='my-0 text-xs'>Order No</p>
                        <p className='my-0 text-md font-semibold'>{selectedOrder.order_number}</p>
                      </div>
                      <div>
                        <p className='my-0 text-xs'>Order Created</p>
                        <p className='my-0 text-md font-semibold'>{selectedOrder.created_at}</p>
                      </div>
                      <div>
                        <p className='my-0 text-xs'>Status</p>
                        <p className='my-0 text-xs inline-block px-[10px] py-[2px] rounded-[6px] bg-green-200 uppercase'>
                          {selectedOrder.status}
                        </p>
                      </div>
                    </div>
                    <div className='grid grid-cols-1 gap-[5px] text-right'>
                      <div>
                        <p className='my-0 text-xs'>Company Contribution - <span className='text-[10px]'>PKR</span> <span className="text-sm font-semibold">{selectedOrder.discount}</span> </p>
                      </div>
                      <div>
                        <p className='my-0 text-xs'>Employee Contribution - <span className='text-[10px]'>PKR</span> <span className="text-sm font-semibold">{selectedOrder.grand_total - selectedOrder.discount}</span> </p>
                      </div>
                      <div>
                        <p className='my-0 font-semibold text-sm'>Grand Total</p>
                        <p className='my-0 text-xl font-semibold text-red-500'><span className='font-normal text-sm'>PKR</span> {selectedOrder.grand_total}</p>
                      </div>
                    </div>
                  </div>

                  <div className="w-full overflow-x-auto">
                    <table className="min-w-full">
                      <thead className="">
                        <tr className="">
                          <th className="py-2 px-4">
                            <div className="flex items-center">
                              <p className="font-medium text-[#000] text-xs">Items</p>
                            </div>
                          </th>
                          <th className="py-2 px-4">
                            <div className="flex items-center justify-center">
                              <p className="font-medium text-[#000] text-xs">Type</p>
                            </div>
                          </th>
                          <th className="py-2 px-4">
                            <div className="flex items-center justify-center">
                              <p className="font-medium text-[#000] text-xs">Brand</p>
                            </div>
                          </th>
                          <th className="py-2 px-4">
                            <div className="flex items-center justify-center">
                              <p className="font-medium text-[#000] text-xs">Measure</p>
                            </div>
                          </th>
                          <th className="py-2 px-4">
                            <div className="flex items-center justify-center">
                              <p className="font-medium text-[#000] text-xs">Quantity</p>
                            </div>
                          </th>
                          <th className="py-2 px-4">
                            <div className="flex items-center justify-center col-span-2">
                              <p className="font-medium text-[#000] text-xs">Sub Total</p>
                            </div>
                          </th>
                        </tr>
                      </thead>

                      <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                        {selectedOrder.items.map((item) => (
                          <tr key={`${selectedOrder.id}-${item.id}`}>
                            <td className="py-3 px-4">
                              <div className="flex items-center">
                                <div className="flex items-center gap-3">
                                  <div className="h-[40px] w-[40px] overflow-hidden rounded-full">
                                    <img src={item.product.image ? `${process.env.NEXT_PUBLIC_BACKEND_URL_PUBLIC}${item.product.image}` : "/images/items/product-default.png"} alt="Product"
                                      onError={(e) => {
                                        e.currentTarget.src = "/images/items/product-default.png";
                                      }}
                                    />
                                  </div>
                                  <div>
                                    <p className="font-medium text-gray-800 text-sm dark:text-white/90 capitalize">
                                      {item.product.name}
                                    </p>
                                    <span className="text-gray-500 text-sm">
                                      {item.unit_price} Rs
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="py-3 px-4">
                              <div className="flex items-center justify-center">
                                <p className="text-gray-500 text-sm dark:text-gray-400">
                                  {item.product.type}
                                </p>
                              </div>
                            </td>
                            <td className="py-3 px-4">
                              <div className="flex items-center justify-center">
                                <p className="text-gray-500 text-sm dark:text-gray-400">
                                  {item.product.brand}
                                </p>
                              </div>
                            </td>
                            <td className="py-3 px-4">
                              <div className="flex items-center justify-center">
                                <p className="text-gray-500 text-sm dark:text-gray-400">
                                  {item.product.measure}
                                </p>
                              </div>
                            </td>
                            <td className="py-3 px-4">
                              <div className="flex items-center justify-center">
                                <p className="text-gray-500 text-sm dark:text-gray-400">
                                  {item.quantity}x
                                </p>
                              </div>
                            </td>
                            <td className="py-3 px-4">
                              <div className="flex items-center justify-center">
                                <p className="text-gray-500 text-sm dark:text-gray-400">
                                  {item.price}
                                </p>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div className="flex justify-end">
                    <div className='shadow-sm border-[2px] rounded-[10px] flex items-center justify-center bg-[#2b3990] hover:text-[#fff] transition-all duration-300 ease-in-out border-[#2b3990]'>
                      <button className="text-sm text-[#fff] uppercase px-4 py-2 rounded-[10px] flex items-center gap-2">
                        Print
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <p className="text-gray-500 text-sm">Select an order to view invoice details.</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}