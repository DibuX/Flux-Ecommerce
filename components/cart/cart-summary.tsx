"use client";

import { useCart } from "@/components/hooks/use-cart";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/utils";
import Link from "next/link";
import type { PaymentMethod } from "@/lib/types";
import "./../../app/cart-summary.css";

interface CartSummaryProps {
  paymentMethods?: PaymentMethod[];
}

export default function CartSummary({ paymentMethods = [] }: CartSummaryProps) {
  const { subtotal } = useCart();
  const shipping = subtotal > 99 ? 0 : 10;
  const total = subtotal + shipping;

  return (
    <div className="summary-container">
      <h3 className="summary-title">Resumen del Pedido</h3>

      <div className="summary-details">
        <div className="summary-row">
          <span className="label">Subtotal</span>
          <span className="value">{formatPrice(subtotal)}</span>
        </div>

        <div className="summary-row">
          <span className="label">Envío</span>
          <span className="value">
            {shipping === 0 ? "Gratis" : formatPrice(shipping)}
          </span>
        </div>

        <div className="summary-total">
          <div className="summary-row total">
            <span>Total</span>
            <span>{formatPrice(total)}</span>
          </div>
          <p className="tax-info">Impuestos incluidos</p>
        </div>
      </div>

      <Link href="/checkout">
        <Button className="summary-checkout-btn" disabled={subtotal === 0}>
          Proceder al Pago
        </Button>
      </Link>

      <div className="payment-methods">
        <h4 className="methods-title">Aceptamos</h4>
        <div className="methods-list">
          {paymentMethods.map((method) => (
            <div key={method.name} className="method-item">
              {method.name.toUpperCase()}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
