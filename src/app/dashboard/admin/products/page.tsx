// app/products/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Header from "@/app/_components/adminheader/index";
import Sidebar from "@/app/_components/adminsidebar/index";
import Breadcrumb from "@/app/_components/ui/Breadcrumb";
import { DriveFileRenameOutline, Create } from "@mui/icons-material";
import { toast } from "react-toastify";
import { Dialog } from '@headlessui/react';
import ErrorMessage from "@/app/_components/error/index";
import Loader from "@/app/_components/loader/index";

interface Product {
  id: number;
  name: string;
  detail: string;
  price: string;
  image: string | null;
}

interface PaginatedProducts {
  current_page: number;
  data: Product[];
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

export default function ProductsPage() {
  const [products, setProducts] = useState<PaginatedProducts | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentPage = searchParams.get('page') || '1';
  const [isOpen, setIsOpen] = useState(false);
  const [enabled, setEnabled] = useState(false);

  const [price, setPrice] = useState('');

  const handleSave = () => {
    console.log('New price:', price);
    setIsOpen(false);
  };
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          router.push('/auth/login');
          return;
        }

        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/admin/products?page=${currentPage}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          toast.error('Failed to fetch products');
        }

        const data = await response.json();
        setProducts(data.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load products');
        if (err instanceof Error) {
          toast.error(err.message);
          setError(err.message);
        } else {
          toast.error("Failed to load products");
          setError("Failed to load products");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [currentPage, router]);


  if (loading) {
    return (
      <Loader />
    );
  }

  if (error) {
    return (
      <ErrorMessage error={error} />
    );
  }

  if (!products?.data?.length) {
    return <ErrorMessage error="No products found" />;
  }

  return (
    <div className="min-h-screen flex gap-[20px] px-[20px] xl:px-[30px]">
      <div className="w-[15%] relative">
        <Sidebar />
      </div>
      <div className="w-full mx-auto space-y-4 p-4">
        <div><Header /></div>
        <div className="px-6 py-6 bg-[#f9f9f9] rounded-[20px] xl:rounded-[25px] text-[#2b3990]">
          <h1 className="text-2xl font-bold my-0">All Product</h1>
          <Breadcrumb
            items={[{ label: "Dashboard" }, { label: "Products" }]}
          />
        </div>

        {/* <div className="mb-6">
        <Link 
          href="/dashboard/admin/products/new"
          className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
        >
          Add New Product
        </Link>
      </div> */}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-[10px] xl:gap-[15px] mb-8">
          {products.data.map((product) => (
            <div key={product.id} className="bg-white rounded-[20px] border-[1px] border-[#2b3990] border-opacity-40 overflow-hidden">
              <div className="flex flex-col h-full">
                <div className="bg-[#f9f9f9] overflow-hidden h-[150px] w-full">
                  <img
                    src={product.image ? `${process.env.NEXT_PUBLIC_BACKEND_URL_PUBLIC}${product.image}` : "/images/items/atta.webp"}
                    alt=""
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = "/images/items/atta.webp";
                    }}
                  />
                </div>
                <div className="py-2 px-3">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold my-0 capitalize">
                      {product.name}
                    </h2>
                    <p className="my-0 text-xs">Flour</p>
                  </div>
                  <div className="flex items-center justify-end">
                    <p className="my-0 text-sm font-semibold">1 kg</p>
                  </div>
                  <div className='relative flex items-center gap-[10px]'>
                    <p className="text-xl font-semibold">
                      {product.price}{" "}
                      <span className="pl-[2px] text-sm font-normal">
                        Rs
                      </span>
                    </p>
                    <button className='text-xs relative group' onClick={() => setIsOpen(true)}>
                      <Create sx={{ fontSize: 15 }} />
                      <span className="absolute top-[-20px] left-[0px] my-0 px-[5px] py-[2px] text-[10px] text-white bg-[#c00] rounded opacity-0 group-hover:opacity-100 transition text-nowrap">
                        Edit Price
                      </span>
                    </button>
                  </div>
                </div>
                <div className="mx-4 mb-2 flex justify-between items-center">
                  <div className='group relative'> 
                    <button
                      onClick={() => setEnabled(!enabled)}
                      className={`w-8 h-4 flex items-center rounded-full p-1 transition duration-300 ease-in-out ${enabled ? 'bg-[#2b3990]' : 'bg-gray-300'
                        }`}
                    >
                      <div
                        className={`bg-white w-2.5 h-2.5 rounded-full shadow-md transform duration-300 ease-in-out ${enabled ? 'translate-x-4' : 'translate-x-0'
                          }`}
                      />
                    </button>
                    <span className="absolute top-[-20px] left-[0px] my-0 px-[5px] py-[2px] text-[10px] text-white bg-[#c00] rounded opacity-0 group-hover:opacity-100 transition text-nowrap">
                      Hide/Show Product
                    </span>
                  </div>
                  <div>
                    <Link
                      href={`/dashboard/admin/products/edit/${product.id}`}
                      className="text-[#2b3990] hover:text-[#00aeef] relative group"
                    >
                      <DriveFileRenameOutline />

                      {/* Tooltip */}
                      <span className="absolute top-[-15px] right-[-5px] my-0 px-[5px] py-[2px] text-[10px] text-white bg-[#c00] rounded opacity-0 group-hover:opacity-100 transition text-nowrap">
                        Edit Product
                      </span>
                    </Link>
                  </div>

                </div>
              </div>
            </div>
          ))}
        </div>


        <Dialog open={isOpen} onClose={() => setIsOpen(false)} className="relative z-50">
          {/* Overlay */}
          <div className="fixed inset-0 bg-black bg-opacity-40" aria-hidden="true"></div>

          {/* Dialog content wrapper */}
          <div className="fixed inset-0 flex items-center justify-center p-4 z-50">
            <Dialog.Panel className="bg-white rounded-xl max-w-sm w-full p-6 space-y-4">
              <Dialog.Title className="text-lg font-semibold text-[#2b3990]">Update Price</Dialog.Title>
              <input
                type="text"
                className="w-full border border-gray-300 rounded px-3 py-2"
                placeholder="Enter new price"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />
              <div className="flex justify-end gap-2">
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

        {/* Pagination Controls */}
        <div className="flex justify-center gap-2">
          {products.links.map((link, index) => {
            if (link.url === null) return null;

            const page = new URL(link.url).searchParams.get('page') || '1';
            const isActive = link.active;
            const label = link.label
              .replace('&laquo; Previous', '«')
              .replace('Next &raquo;', '»');

            return (
              <Link
                key={index}
                href={`/dashboard/admin/products?page=${page}`}
                className={`px-4 py-2 rounded-lg border ${isActive
                  ? 'bg-[#2b3990] text-white border-blue-500'
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                  }`}
              >
                {label}
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}