// app/products/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Header from "@/app/_components/header/index";
import Sidebar from "@/app/_components/sidebar/index";
import Breadcrumb from "@/app/_components/ui/Breadcrumb";
import { DriveFileRenameOutline } from "@mui/icons-material";
import { toast } from "react-toastify";

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

  if (loading) return <div className="container mx-auto p-4">Loading...</div>;
  if (error) return <div className="container mx-auto p-4 text-red-500">{error}</div>;
  if (!products?.data?.length) return <div className="container mx-auto p-4">No products found</div>;

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
            <div key={product.id} className="bg-white rounded-[20px] overflow-hidden border-[1px] border-[#2b3990] border-opacity-40">
              <div className="flex flex-col h-full">
                <div className="bg-[#f9f9f9] rounded-t-lg overflow-hidden h-[150px] w-full">
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
                  <p className="text-xl font-semibold">
                    {product.price}{" "}
                    <span className="pl-[2px] text-sm font-normal">
                      Rs
                    </span>
                  </p>
                </div>
                <div className="mx-4 mb-2 flex justify-end">
                  <Link
                    href={`/dashboard/admin/products/edit/${product.id}`}
                    className="text-[#2b3990] hover:text-[#00aeef]"
                  >
                    <DriveFileRenameOutline />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

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