// Cart API Types

export interface CartItemResponse {
  cartItemId: number;
  variantId: number;
  variantName?: string;
  sku?: string;
  productId?: number;
  productName?: string;
  price: number;
  quantity: number;
  stockQuantity?: number;
  subtotal?: number;
  thumbnailUrl?: string; // Backend uses thumbnailUrl
  imageUrl?: string; // Backward compatibility
}

export interface CartResponse {
  cartId: number;
  userId: number;
  items: CartItemResponse[];
  totalItems: number;
  totalPrice: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface AddToCartRequest {
  variantId: number;
  quantity: number;
}

export interface UpdateCartItemRequest {
  quantity: number;
}
