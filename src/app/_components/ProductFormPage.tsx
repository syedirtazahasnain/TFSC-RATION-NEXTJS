"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import Loader from "@/app/_components/loader/index";

interface ProductFormProps {
  productId?: string;
}

interface Product {
  id?: number;
  name: string;
  detail: string;
  price: string;
  image?: string | File;
  measure: string;
  type: string;
  brand?: string;
  status?: string;
}

interface ValidationErrors {
  [key: string]: string[];
}

export default function ProductFormPage({ productId }: ProductFormProps) {
  const router = useRouter();
  const [product, setProduct] = useState<Product>({
    name: '',
    detail: '',
    price: '',
    measure: '',
    type: '',
    brand: '',
  });
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(!!productId);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<ValidationErrors>({});

  useEffect(() => {
    if (!productId) {
      setIsLoading(false);
      return;
    }

    const fetchProduct = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/admin/products/${productId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch product");
        }

        const data = await response.json();
        setProduct(data.data);
        if (data.data.image) {
          setImagePreview(
            `${process.env.NEXT_PUBLIC_BACKEND_URL_PUBLIC}${data.data.image}`
          );
        }
      } catch (error) {
        toast.error(
          error instanceof Error ? error.message : "Failed to load product"
        );
        router.push("/dashboard/admin/products");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduct();
  }, [productId, router]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setProduct((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when field is changed
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = {...prev};
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast.error("Image must be smaller than 2MB");
        return;
      }
      setProduct((prev) => ({ ...prev, image: file }));

      const reader = new FileReader();
      reader.onload = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrors({});

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/auth/login");
        return;
      }

      const formData = new FormData();
      formData.append("name", product.name.trim());
      formData.append("detail", product.detail.trim());
      formData.append("price", product.price.trim());
      formData.append("measure", product.measure.trim());
      formData.append("type", product.type.trim());
      
      if (product.brand) {
        formData.append('brand', product.brand.trim());
      }
      
      if (product.image instanceof File) {
        formData.append("image", product.image);
      }
      
      if (productId) {
        formData.append("id", productId);
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/admin/store-products`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 403 && data.errors) {
          // Handle validation errors
          setErrors(data.errors);
          toast.error("Please fix the validation errors");
          return;
        }
        throw new Error(data.message || "Failed to save product");
      }

      toast.success(data.message || "Product saved successfully");
      router.push("/dashboard/admin/products");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to save product"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <Loader />;
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-[10px] xl:gap-[20px]">
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">
            Product Name *
          </label>
          <input
            type="text"
            name="name"
            value={product.name}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-md ${errors.name ? 'border-red-500' : ''}`}
            required
          />
          {errors.name && (
            <p className="text-red-500 text-xs mt-1">{errors.name[0]}</p>
          )}
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">
            Description *
          </label>
          <textarea
            name="detail"
            value={product.detail}
            onChange={handleChange}
            rows={4}
            className={`w-full px-3 py-2 border rounded-md ${errors.detail ? 'border-red-500' : ''}`}
            required
          />
          {errors.detail && (
            <p className="text-red-500 text-xs mt-1">{errors.detail[0]}</p>
          )}
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">
            Price *
          </label>
          <input
            type="number"
            name="price"
            value={product.price}
            onChange={handleChange}
            min="0"
            step="0.01"
            className={`w-full px-3 py-2 border rounded-md ${errors.price ? 'border-red-500' : ''}`}
            required
          />
          {errors.price && (
            <p className="text-red-500 text-xs mt-1">{errors.price[0]}</p>
          )}
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">
            Measure *
          </label>
          <input
            type="text"
            name="measure"
            value={product.measure}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-md ${errors.measure ? 'border-red-500' : ''}`}
            required
          />
          {errors.measure && (
            <p className="text-red-500 text-xs mt-1">{errors.measure[0]}</p>
          )}
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">
            Type *
          </label>
          <select
            name="type"
            value={product.type}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-md ${errors.type ? 'border-red-500' : ''}`}
            required
          >
            <option value="">Select Type</option>
            <option value="Milk">Milk</option>
            <option value="Rice">Rice</option>
          </select>
          {errors.type && (
            <p className="text-red-500 text-xs mt-1">{errors.type[0]}</p>
          )}
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">
            Brand (optional)
          </label>
          <input
            type="text"
            name="brand"
            value={product.brand || ''}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-md"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">
            Product Image
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="w-full px-3 py-2 border rounded-md"
          />
          {imagePreview && (
            <div className="mt-2">
              <img
                src={imagePreview}
                alt="Preview"
                className="h-40 object-contain border rounded"
              />
            </div>
          )}
        </div>
      </div>
      <div className="flex justify-end space-x-4 pt-4">
        <button
          type="button"
          onClick={() => router.push("/dashboard/admin/products")}
          className="px-4 py-2 border rounded-md bg-[#f9f9f9] hover:bg-gray-200"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-4 py-2 border rounded-md bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
        >
          {isSubmitting ? "Saving..." : "Save Product"}
        </button>
      </div>
    </form>
  );
}