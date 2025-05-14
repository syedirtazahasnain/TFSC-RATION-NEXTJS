"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import Loader from "@/app/_components/loader/index";
import { Input, Select, SelectItem, Textarea } from "@heroui/react";
interface ProductFormProps {
  productId?: string;
}

export const types = [
  { key: "Flour", label: "Flour" },
  { key: "Rice", label: "Rice" },
  { key: "Milk", label: "Milk" },
  { key: "Oil", label: "Oil" },
  { key: "Tea", label: "Tea" },
  { key: "Surf", label: "Surf" },
  { key: "Pulses", label: "Pulses" },
  { key: "Spices", label: "Spices" },
];

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
        const newErrors = { ...prev };
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
          <Input
            name="name"
            type="text"
            className="w-full"
            label="Product Name"
            value={product.name}
            onChange={handleChange}
            classNames={{
              inputWrapper: "",
            }}
            isRequired
          />
        </div>
        <div>
          <Input
            name="price"
            type="number"
            className="w-full"
            label="Product Price"
            value={product.price}
            onChange={handleChange}
            classNames={{
              inputWrapper: "",
            }}
            isRequired
          />
        </div>
        <div>
          <Input
            name="measure"
            type="text"
            className="w-full"
            label="Measure"
            value={product.measure}
            onChange={handleChange}
            classNames={{
              inputWrapper: "",
            }}
            isRequired
          />
        </div>
        <div>
          <Select
            name="type"
            className="w-full"
            label="Product Type"
            defaultSelectedKeys={[product.type]}
            onChange={handleChange}
            isRequired
          >
            {types.map((type) => (
              <SelectItem key={type.key}>
                {type.label}
              </SelectItem>
            ))}
          </Select>

        </div>
        <div>
          <Input
            name="brand"
            type="text"
            className="w-full"
            label="Brand (Optional)"
            value={product.brand}
            onChange={handleChange}
            classNames={{
              inputWrapper: "",
            }}
          />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-[10px] xl:gap-[20px] mt-[10px] xl:mt-[20px]">
        <div>
          <Input
            name="file"
            type="file"
            className="w-full"
            label="Product Image"
            onChange={handleImageChange}
            accept="image/*"
            classNames={{
              inputWrapper: "",
            }}
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
        <div>
          <Textarea
            name="detail"
            className="w-full"
            label="Product Detail"
            value={product.detail}
            onChange={handleChange}
            classNames={{
              inputWrapper: "",
            }}
          />
        </div>
      </div>
      <div className="flex justify-start space-x-2 pt-4">
        <button
          type="button"
          onClick={() => router.push("/dashboard/admin/products")}
          className="px-4 py-2 border rounded-[12px] bg-[#fff] hover:bg-gray-900 hover:text-[#fff]"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-4 py-2 border rounded-[12px] bg-[#2b3990] text-white hover:bg-[#00aeef] disabled:opacity-50"
        >
          {isSubmitting ? "Saving..." : "Save Product"}
        </button>
      </div>
    </form>
  );
}