export const dynamic = "force-dynamic";
import Link from "next/link";
import { ArrowLeft, ShoppingCart, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";
import CartItems from "@/components/cart/cart-items";
import CartSummary from "@/components/cart/cart-summary";
import { paymentMethodRepository } from "@/lib/db/repositories/paymentMethodRepository";
import "./../cart-styles.css";

export const metadata = {
  title: "Carrito de Compras | Flux",
  description: "Revisa los productos en tu carrito de compras",
};

export default async function CartPage() {
  const paymentMethods = await paymentMethodRepository.getAllPaymentMethods();

  return (
    <section className="cart-page">
      <div className="cart-header">
        <h1>
          <ShoppingCart className="icon" />
          Carrito de Compras
        </h1>
        <p>Revisa y actualiza los productos en tu carrito</p>
      </div>

      <div className="cart-content">
        <div className="cart-items">
          <CartItems />
        </div>

        <aside className="cart-summary">
          <CartSummary paymentMethods={paymentMethods} />

          <div className="shipping-info">
            <Truck className="icon-small" />
            <div>
              <h3>Información de Envío</h3>
              <p>Envío gratis en pedidos superiores a $99</p>
            </div>
          </div>

          <div className="cart-actions">
            <Link href="/checkout">
              <Button className="checkout-btn">Proceder al Pago</Button>
            </Link>
            <Link href="/">
              <Button variant="outline" className="continue-btn">
                <ArrowLeft className="icon-small" />
                Continuar Comprando
              </Button>
            </Link>
          </div>
        </aside>
      </div>
    </section>
  );
}
