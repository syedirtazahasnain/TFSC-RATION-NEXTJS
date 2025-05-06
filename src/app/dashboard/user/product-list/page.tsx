"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/app/_components/sidebar/index";
import Breadcrumb from "@/app/_components/ui/Breadcrumb";
import LoaderNew from "@/app/_components/loader/newindex";
import "@/app/extra.css";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import {
  AddShoppingCart,
  Delete,
  HighlightOff,
  Close,
  ArrowForwardIos,
} from "@mui/icons-material";
import Header from "@/app/_components/header/index";
import { Edit, Save } from "@mui/icons-material";

interface CartItem {
  id?: number;
  cart_id?: number;
  product_id: number;
  quantity: number;
  unit_price: number | string;
  total: number | string;
  created_at?: string;
  updated_at?: string;
  deleted_at?: string | null;
  product?: {
    id: number;
    name: string;
    detail: string;
    price: number;
    image?: string;
    measure?: string;
  };
}

interface CartResponse {
  success: boolean;
  status_code: number;
  message: string;
  data?: {
    cart_data: CartItem[] | { items: CartItem[] };
    payable_amount: number;
    employee_contribution: number;
    company_discount: number;
  };
  errors?: {
    cart_data: CartItem[] | { items: CartItem[] };
    payable_amount: number;
    employee_contribution: number;
    company_discount: number;
  };
}

interface CartData {
  id: number;
  user_id: number;
  items: CartItem[];
  payable_amount: number;
  employee_contribution: number;
  company_discount: number;
}

interface Product {
  id: number;
  name: string;
  image: string;
  type: string;
  detail: string;
  price: number;
  measure: string;
}

export default function ProductListPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartData, setCartData] = useState<CartData | null>(null);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [apiResponse, setApiResponse] = useState<string>("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editedQuantity, setEditedQuantity] = useState<number>(1);
  const [localQuantities, setLocalQuantities] = useState<{
    [key: number]: number;
  }>({});
  const router = useRouter();
  const MySwal = withReactContent(Swal);

  // Fetch products from the backend
  const fetchProducts = async (page: number) => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/auth/login");
        return;
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/products?page=${page}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        toast.error("Failed to fetch products");
      }

      const data = await response.json();
      setProducts(data.data.data);
      setAllProducts((prev) => [...prev, ...data.data.data]);
      setTotalPages(data.data.last_page);
      setCurrentPage(data.data.current_page);
    } catch (err) {
      toast.error("Failed to fetch products. Please try again.");
      setError("Failed to fetch products. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Fetch cart from backend
  const fetchCart = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/auth/login");
        return;
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/cart`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data: CartResponse = await response.json();

      if (!response.ok) {
        toast.error(data.message || "Failed to fetch cart");
        return;
      }
      if (data.data?.cart_data) {
        const cartItemsArray = Array.isArray(data.data.cart_data)
          ? data.data.cart_data
          : data.data.cart_data.items;

        const cartItems = cartItemsArray.map((item) => ({
          id: item.id,
          cart_id: item.cart_id,
          product_id: item.product_id,
          quantity:
            typeof item.quantity === "string"
              ? parseInt(item.quantity)
              : item.quantity,
          unit_price:
            typeof item.unit_price === "string"
              ? parseFloat(item.unit_price)
              : item.unit_price,
          total:
            typeof item.total === "string"
              ? parseFloat(item.total)
              : item.total,
          product: item.product,
        }));

        setCart(cartItems);
        setCartData({
          id: 0,
          user_id: 0,
          items: cartItems,
          payable_amount: data.data.payable_amount,
          employee_contribution: data.data.employee_contribution,
          company_discount: data.data.company_discount,
        });

        // Initialize local quantities
        const quantities: { [key: number]: number } = {};
        cartItems.forEach((item: CartItem) => {
          quantities[item.product_id] = item.quantity as number;
        });
        setLocalQuantities(quantities);
      }
    } catch (err) {
      toast.error(
        `Error fetching cart: ${err instanceof Error ? err.message : String(err)
        }`
      );
      console.error("Error fetching cart:", err);
    }
  };

  // Sync cart with backend
  const syncCartWithBackend = async (cartItems: CartItem[]) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/auth/login");
        return;
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/cart/add`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            products: cartItems.map((item) => ({
              product_id: item.product_id,
              quantity: item.quantity,
              id: item.id,
            })),
          }),
        }
      );

      const data: CartResponse = await response.json();

      if (!response.ok) {
        if (data.errors?.cart_data) {
          const errorCartItemsArray = Array.isArray(data.errors.cart_data)
            ? data.errors.cart_data
            : data.errors.cart_data.items;

          const errorCartItems = errorCartItemsArray.map((item) => ({
            id: item.id,
            product_id: item.product_id,
            quantity:
              typeof item.quantity === "string"
                ? parseInt(item.quantity)
                : item.quantity,
            unit_price:
              typeof item.unit_price === "string"
                ? parseFloat(item.unit_price)
                : item.unit_price,
            total:
              typeof item.total === "string"
                ? parseFloat(item.total)
                : item.total,
            product:
              allProducts.find((p) => p.id === item.product_id) || undefined,
          }));

          setCart(errorCartItems);
          setCartData({
            id: 0,
            user_id: 0,
            items: errorCartItems,
            payable_amount: data.errors.payable_amount,
            employee_contribution: data.errors.employee_contribution,
            company_discount: data.errors.company_discount,
          });
        }
        toast.error(data.message || "Failed to sync cart with backend");
        return;
      }

      if (data.data?.cart_data) {
        // Handle both array and object formats for success response
        const updatedCartArray = Array.isArray(data.data.cart_data)
          ? data.data.cart_data
          : data.data.cart_data.items;

        const updatedCart = updatedCartArray.map((item) => ({
          id: item.id,
          product_id: item.product_id,
          quantity:
            typeof item.quantity === "string"
              ? parseInt(item.quantity)
              : item.quantity,
          unit_price:
            typeof item.unit_price === "string"
              ? parseFloat(item.unit_price)
              : item.unit_price,
          total:
            typeof item.total === "string"
              ? parseFloat(item.total)
              : item.total,
          product:
            allProducts.find((p) => p.id === item.product_id) || undefined,
        }));

        setCart(updatedCart);
        setCartData({
          id: 0,
          user_id: 0,
          items: updatedCart,
          payable_amount: data.data.payable_amount,
          employee_contribution: data.data.employee_contribution,
          company_discount: data.data.company_discount,
        });

        const quantities: { [key: number]: number } = {};
        updatedCart.forEach((item: CartItem) => {
          quantities[item.product_id] = item.quantity as number;
        });
        setLocalQuantities(quantities);
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to sync cart with backend";
      toast.error(errorMessage);
      setError(errorMessage);
    }
  };

  // Update cart state from backend response
  const updateCartState = (cartData: any) => {
    setCartData(cartData);
    const cartItemsArray = Array.isArray(cartData.items)
      ? cartData.items
      : cartData.items.items;

    const cartItems = cartItemsArray.map((item: any) => ({
      id: item.id,
      product_id: item.product_id,
      quantity: parseInt(item.quantity),
      unit_price: parseFloat(item.unit_price),
      total: parseFloat(item.total),
      product: item.product,
    }));
    setCart(cartItems);

    // Update local quantities
    const quantities: { [key: number]: number } = {};
    cartItems.forEach((item: CartItem) => {
      quantities[item.product_id] = item.quantity as number;
    });
    setLocalQuantities(quantities);
  };

  // Add product to cart
  const addToCart = async (
    productId: number,
    quantity: number,
    itemId?: number
  ) => {
    if (quantity <= 0) {
      alert("Quantity must be greater than 0.");
      return;
    }
    updateLocalQuantity(productId, quantity);
  
    let updatedCart;
    if (itemId) {
      updatedCart = cart.map((item) =>
        item.id === itemId ? { ...item, quantity } : item
      );
    } else {
      const existingProduct = cart.find((item) => item.product_id === productId);
      if (existingProduct) {
        updatedCart = cart.map((item) =>
          item.product_id === productId ? { ...item, quantity } : item
        );
      } else {
        const product = allProducts.find((p) => p.id === productId);
        if (!product) {
          console.error("Product not found");
          return;
        }
  
        const unit_price = product.price;
        const total = unit_price * quantity;
  
        const newItem: CartItem = {
          product_id: productId,
          quantity,
          unit_price,
          total,
          product,
        };
  
        updatedCart = [...cart, newItem];
      }
    }
    setCart(updatedCart);
  
    await syncCartWithBackend(updatedCart);
  };
  // Update local quantity state
  const updateLocalQuantity = (productId: number, value: number) => {
    setLocalQuantities((prev) => ({
      ...prev,
      [productId]: value,
    }));
  };

  // Remove item from cart
  const removeFromCart = async (itemId: number) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/auth/login");
        return;
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/cart/remove/${itemId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.message || "Failed to remove item from cart");
      }

      // Update cart with backend response
      if (data.data && data.data.cart_data) {
        updateCartState(data.data.cart_data);
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to remove item from cart";

      toast.error(errorMessage);
      setError(errorMessage);
    }
  };

  // Clear entire cart
  const clearCart = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/auth/login");
        return;
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/cart/clear`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.message || "Failed to clear cart");
      }

      // Clear cart state
      setCart([]);
      setCartData(null);
      setLocalQuantities({});
      toast.success("Cart cleared Successfully!");
      setApiResponse("Cart cleared successfully");
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to clear cart";

      toast.error(errorMessage);
      setError(errorMessage);
    }
  };
  
  const handleClearCart = async () => {
    const result = await MySwal.fire({
      title: "Clear your cart?",
      text: "This will remove all items from your cart. This action cannot be undone!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, clear cart!",
      cancelButtonText: "Cancel",
      reverseButtons: true
    });
  
    if (result.isConfirmed) {
      await clearCart();
    }
  };

  const submitCart = async () => {
    const result = await MySwal.fire({
      title: "Are you sure?",
      text: "Once the order is placed, it cannot be reverted!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, place order!",
      cancelButtonText: "Cancel"
    });

    if (!result.isConfirmed) {
      return;
    }
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/auth/login");
        return;
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/orders/place`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ products: cart }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        toast.success(data.message || "Order placed successfully!");
        setApiResponse(data.message || "Order placed successfully!");
        setCart([]); // Clear the cart after successful submission
        setLocalQuantities({}); // Clear local quantities
        setCartData(null); // Clear cart data
        // router.push(`/orders/${data.data.id}`);
        router.push(`/dashboard/user/orders/${data.data.id}`);
      } else {
        toast.error(data.message || "Failed to place order");
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Failed to place order. Please try again.";

      toast.error(errorMessage);
      setApiResponse(errorMessage);
    }
  };

  // Fetch products and cart when the page loads or when the page number changes
  useEffect(() => {
    fetchProducts(currentPage);
    fetchCart();
  }, [currentPage]);

  // Calculate total price and quantity
  const totalPrice =
    cartData?.payable_amount ??
    cart.reduce((total, item) => total + Number(item.total || 0), 0);

  const totalQuantity =
    cart.reduce((total, item) => total + Number(item.quantity || 0), 0);


  return (
    <div className="min-h-screen flex gap-[20px] px-[20px] xl:px-[30px]">
      <div className="w-[15%] relative">
        <Sidebar />
      </div>
      <div className="w-full mx-auto space-y-4 p-4">
        <div>
          <Header />
        </div>
        <div className="px-6 py-6 bg-[#f9f9f9] rounded-[20px] xl:rounded-[25px] text-[#2b3990] relative">
          <h1 className="text-2xl font-bold my-0">All Products</h1>
          <Breadcrumb items={[{ label: "Dashboard" }, { label: "Products" }]} />
          <div
            className="hidden absolute top-[10px] right-[10px] z-40 bg-[#fff] p-[10px] rounded-[15px] cursor-pointer"
            onClick={() => setIsCartOpen(!isCartOpen)}
          >
            {isCartOpen ? (
              <AddShoppingCart />
            ) : (
              <div className="flex items-center gap-1 relative">
                <AddShoppingCart className="text-[#000]" />
                <div className="absolute top-[-12px] left-[-12px] w-[18px] h-[18px] bg-[#c00] rounded-full flex items-center justify-center">
                  <p className="text-xs my-0 text-[#fff]">{totalQuantity}</p>
                </div>
              </div>
            )}
          </div>
        </div>
        {loading ? (
          <LoaderNew />
        ) : (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-7 gap-[10px] xl:gap-[15px] relative h-[75vh] overflow-hidden">
              <div className="lg:col-span-5 overflow-y-auto rashnItems">
                <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-[10px] xl:gap-[15px]">
                  {Array.isArray(products) &&
                    products.map((product) => {
                      const cartItem = cart.find(
                        (item) => item.product_id === product.id
                      );
                      const quantity = localQuantities[product.id] || 1;

                      return (
                        <div
                          key={product.id}
                          className="bg-white rounded-[20px] overflow-hidden border-[1px] border-[#2b3990] border-opacity-40 relative"
                        >
                          <div className="bg-[#f9f9f9] rounded-t-lg overflow-hidden w-full">
                            <img
                              src={
                                product.image
                                  ? `${process.env.NEXT_PUBLIC_BACKEND_URL_PUBLIC}${product.image}`
                                  : "/images/items/product-default.png"
                              }
                              alt=""
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.currentTarget.src = "/images/items/product-default.png";
                              }}
                            />
                          </div>
                          <div className="pt-2 pb-14 2xl:pb-10 px-3">
                            <div className="">
                              <h2 className="text-sm font-semibold my-0 capitalize">
                                {product.name}
                              </h2>
                              <p className="my-0 text-xs text-right">{product.type}</p>
                            </div>
                            <div className="flex items-center justify-between">
                              <p className="text-xl font-semibold">
                                {product.price}{" "}
                                <span className="pl-[2px] text-sm font-normal">
                                  Rs
                                </span>
                              </p>
                              <p className="my-0 text-sm font-semibold">{product?.measure ?? "Unit"}</p>
                            </div>
                            <div className="absolute bottom-2 left-2">
                              <div className="grid grid-cols-2 gap-[10px]">
                                <div className="flex items-center relative">
                                  <p className="text-sm ml-[3px] my-0">x</p>
                                  <input
                                    type="number"
                                    min="1"
                                    value={quantity}
                                    onChange={(e) => {
                                      const value = parseInt(e.target.value);
                                      if (!isNaN(value) && value > 0) {
                                        updateLocalQuantity(product.id, value);
                                      }
                                    }}
                                    className="w-full pl-[3px] pr-[10px] my-0 text-left text-lg outline-none bg-transparent text-nowrap"
                                  />
                                  <div className="flex gap-[2px] absolute right-0 top-1/2 -translate-y-1/2">
                                    <button
                                      onClick={() =>
                                        quantity > 1 &&
                                        updateLocalQuantity(
                                          product.id,
                                          quantity - 1
                                        )
                                      } className="w-[20px] h-[20px] flex items-center justify-center rounded bg-[#c00] bg-opacity-10 hover:bg-opacity-30">
                                      <p className="text-lg text-[#000] m-0 pt-[1px]">
                                        -
                                      </p>
                                    </button>
                                    <button
                                      onClick={() =>
                                        updateLocalQuantity(
                                          product.id,
                                          quantity + 1
                                        )
                                      } className="w-[20px] h-[20px] flex items-center justify-center rounded bg-[#c00] bg-opacity-10 hover:bg-opacity-30">
                                      <p className="text-lg text-[#000] m-0 pt-[1px]">
                                        +
                                      </p>
                                    </button>
                                  </div>
                                </div>
                                <div className="w-full pr-[5px]">
                                  <button
                                    onClick={() =>
                                      addToCart(product.id, quantity)
                                    } className="py-[5px] bg-[#2b3990] text-[10px] rounded-[5px] text-[#fff] font-semibold w-full">
                                    <div className="flex items-center justify-center">
                                      <p className="text-center my-0">Add To Cart</p>
                                    </div>
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                </div>
                {/* Pagination */}
                <div className="flex justify-center mt-8">
                  {Array.from({ length: totalPages }, (_, index) => (
                    <button
                      key={index + 1}
                      onClick={() => setCurrentPage(index + 1)}
                      className={`mx-1 px-4 py-2 rounded ${currentPage === index + 1
                        ? "bg-blue-500 text-white"
                        : "bg-white text-blue-500 border border-blue-500"
                        }`}
                    >
                      {index + 1}
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-[#f9f9f9] rounded-[15px] px-6 py-0 relative lg:col-span-2 overflow-y-auto rashnItems">
                <div>
                  <div className="flex justify-between items-center mt-4">
                    <h2 className="text-xl font-bold my-0">Cart Items</h2>
                    <Delete
                      onClick={handleClearCart}
                      className="text-[#c00] cursor-pointer w-3 h-3"
                    />
                  </div>
                  {cart.length === 0 ? (
                    <p>Your cart is empty.</p>
                  ) : (
                    <>
                      <div className="my-2">

                        <div>
                          <p className='my-0 text-xs'>Employee Contribution - <span className='text-[10px]'>PKR</span> <span className="text-sm font-semibold">
                            {cartData?.employee_contribution
                                ? cartData.employee_contribution.toFixed(2)
                                : totalPrice.toFixed(2)}
                          </span> </p>
                          <p className='my-0 text-xs'>Company Contribution - <span className='text-[10px]'>PKR</span> <span className="text-sm font-semibold">
                          {cartData?.company_discount
                                ? cartData.company_discount.toFixed(2)
                                : totalPrice.toFixed(2)}
                          </span> </p>
                          <p className='text-right my-0 text-sm text-red-500 font-semibold'>Grand Total - <span className='text-xs'>PKR</span> <span className="text-lg font-semibold">
                            {cartData?.payable_amount
                              ? cartData.payable_amount.toFixed(0)
                              : totalPrice.toFixed(0)}
                          </span> </p>
                          <div className="flex justify-end">
                            <p className="font-semibold text-xs uppercase py-[1px] px-[10px] rounded-[5px] text-[#fff] bg-[#2b3990]">
                              Items:{" "}
                              {cart.reduce(
                                (sum, item) =>
                                  sum +
                                  (typeof item.quantity === "string"
                                    ? parseInt(item.quantity)
                                    : item.quantity),
                                0
                              )}
                            </p>
                          </div>
                        </div>
                      </div>
                      <ul className="overflow-y-auto">
                        {cart.map((item) => {
                          const product =
                            item.product ||
                            allProducts.find((p) => p.id === item.product_id);
                          return (
                            <li
                              key={item.id || item.product_id}
                              className="mb-2 p-[10px] rounded-[15px] bg-[#fff] relative w-full flex items-center gap-[10px]"
                            >
                              <div className="">
                                <div className="w-[45px] rounded-lg h-full overflow-hidden">
                                  <img
                                    src={
                                      item.product?.image
                                        ? `${process.env.NEXT_PUBLIC_BACKEND_URL_PUBLIC}${item.product.image}`
                                        : "/images/items/product-default.png"
                                    }
                                    alt={item.product?.name || "Product image"}
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                      e.currentTarget.src =
                                        "/images/items/product-default.png";
                                    }}
                                  />
                                </div>
                              </div>
                              <div className="w-full">
                                <div>
                                  <div className="flex items-center gap-[15px] font-semibold capitalize">
                                    <div className="flex items-center gap-[15px] capitalize text-xs">
                                      <span className="font-normal">{product?.name}{" "}</span>
                                      <span className="text-[15px] font-semibold lowercase"> x {item.quantity}</span>
                                    </div>
                                  </div>
                                  <div className="pt-[4px] flex justify-between items-center">
                                    <p className="font-semibold">
                                      {item.total}
                                      <span className="pl-[4px] text-xs font-normal">
                                        Rs
                                      </span>
                                    </p>

                                    <div className="flex gap-[5px] items-center">
                                      {/* Minus Button */}
                                      <button
                                        onClick={async () => {
                                          const newQty = Math.max(item.quantity - 1, 1);
                                          try {
                                            await addToCart(item.product_id, newQty, item.id);
                                            setCart((prevCart) =>
                                              prevCart.map((cartItem) =>
                                                cartItem.id === item.id
                                                  ? { ...cartItem, quantity: newQty }
                                                  : cartItem
                                              )
                                            );
                                          } catch (error) {
                                            toast.error("Failed to update quantity");
                                          }
                                        }}
                                        className="w-[15px] h-[15px] bg-[#c00] flex items-center justify-center rounded"
                                      >
                                        <p className="text-xs text-[#fff] m-0 pt-[1px]">-</p>
                                      </button>

                                      {/* Plus Button */}
                                      <button
                                        onClick={async () => {
                                          const newQty = item.quantity + 1;

                                          // Create a temporary cart with the updated quantity
                                          const updatedCart = cart.map((cartItem) =>
                                            cartItem.id === item.id
                                              ? { ...cartItem, quantity: newQty }
                                              : cartItem
                                          );

                                          // Recalculate total based on updated cart
                                          const newTotal = updatedCart.reduce((total, cartItem) => {
                                            const price = cartItem.product?.price || 0;
                                            return total + price * cartItem.quantity;
                                          }, 0);

                                          if (newTotal > 25000) {
                                            toast.error("Total amount cannot exceed 25,000");
                                            return;
                                          }

                                          try {
                                            await addToCart(item.product_id, newQty, item.id);
                                            setCart(updatedCart);
                                          } catch (error) {
                                            toast.error("Failed to update quantity");
                                          }
                                        }}
                                        className="w-[15px] h-[15px] bg-[#c00] flex items-center justify-center rounded"
                                      >
                                        <p className="text-xs text-[#fff] m-0 pt-[1px]">+</p>
                                      </button>

                                    </div>
                                    <p className="my-0 text-sm px-[10px] bg-[#2b3990] rounded-[5px] text-[#fff]">
                                      {item.unit_price}{" "}
                                      <span className="text-xs pl-[3px] font-semibold"> {item.product?.measure ?? "Unit"}
                                      </span>
                                    </p>
                                  </div>
                                </div>
                                <div className="absolute top-[5px] right-[5px] flex items-center gap-1">
                                  <button
                                    onClick={() => removeFromCart(item.id!)}
                                    className="text-[#c00] hover:text-[#000] cursor-pointer duration-200 ease-in-out transition-all w-[18px] h-[18px] flex items-center justify-center overflow-hidden"
                                  >
                                    <Close className="p-1" />
                                  </button>
                                </div>
                              </div>
                            </li>
                          );
                        })}
                      </ul>
                      <div className="flex justify-end mb-4">
                        <button
                          onClick={submitCart}
                          className="bg-green-400 text-white px-8 py-2 rounded-[10px] hover:bg-green-700 text-sm uppercase font-semibold"
                        >
                          Submit
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
