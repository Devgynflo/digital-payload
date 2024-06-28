"use client";

import { useCart } from "@/hooks/use-cart";
import { cn } from "@/lib/utils";
import { trpc } from "@/trpc/client";
import { NextPage } from "next";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

interface PaymentStatusProps {
  orderId: string;
  orderEmail: string;
  isPaid: boolean;
}

export const PaymentStatus: NextPage<PaymentStatusProps> = ({
  isPaid,
  orderEmail,
  orderId,
}) => {
  const router = useRouter();
  const { clearCart } = useCart();
  const { data } = trpc.payment.pollOrderStatus.useQuery(
    { orderId },
    {
      enabled: isPaid === false,
      refetchInterval: (data) => (data?.isPaid ? false : 10000 * 6),
    },
  );

  useEffect(() => {
    if (data?.isPaid) {
      clearCart();
      router.refresh();
    }
    clearCart();
  }, [data?.isPaid, router, clearCart]);

  return (
    <div className="mt-4 grid grid-cols-2 gap-x-4 text-sm text-gray-600">
      <div>
        <p className="font-medium text-gray-900">Envoyé à:</p>
        <p>{orderEmail}</p>
      </div>

      <div>
        <p className="font-medium text-gray-900">Status de la commande</p>
        <p className={cn(isPaid ? "text-green-500" : "text-red-500")}>
          {isPaid ? "Paiement accepté" : "Paiment en attente"}
        </p>
      </div>
    </div>
  );
};
