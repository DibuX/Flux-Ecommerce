// app/client-layout.tsx
"use client";

import { useEffect, useState } from "react";
import React from "react";
import "./home-styles.css"

export default function ClientLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    // Solo se ejecuta en el cliente
    setIsClient(true);
  }, []);

  // Mientras no esté listo el cliente, no se muestra nada
  if (!isClient) {
    return <>{children}</>; 
  }

  // Cuando el cliente está listo, renderizamos el contenido
  return <>{children}</>;
}
