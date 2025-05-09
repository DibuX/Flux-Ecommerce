"use client";

import { ShoppingCart } from 'lucide-react';
import { useCart } from "@/contexts/cart-context";
import { CartItem } from "@/lib/types";
import { Button } from "@/components/ui/button";

interface AddToCartButtonProps {
  product: CartItem;
  className?: string;
  variant?: "default" | "secondary" | "outline" | "ghost" | "link" | "destructive";
}

export default function AddToCartButton({ 
  product, 
  className = "", 
  variant = "default" 
}: AddToCartButtonProps) {
  const { addItem } = useCart();
  
  const handleAddToCart = () => {
    addItem(product);
  };
  
  return (
    <Button 
      onClick={handleAddToCart}
      variant={variant}
      className={`flex items-center justify-center gap-2 ${className}`}
    >
      <ShoppingCart size={20} />
      <span>Añadir al Carrito</span>
    </Button>
  );
}
