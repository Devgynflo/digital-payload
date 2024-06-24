"use client";

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
  const { data } = trpc.payment.pollOrderStatus.useQuery(
    { orderId },
    {
      enabled: isPaid === false,
      refetchInterval: (data) => (data?.isPaid ? false : 10000 * 6),
    },
  );

  useEffect(() => {
    if (data?.isPaid) {
      router.refresh();
    }
  }, [data?.isPaid, router]);

  return (
    <div className="mt-16 grid grid-cols-2 gap-x-4 text-sm text-gray-600">
      <div>
        <p className="font-medium text-gray-900">Shipping to</p>
        <p>{orderEmail}</p>
      </div>

      <div>
        <p className="font-medium text-gray-900">Order status</p>
        <p className={cn(isPaid ? "text-green-500" : "text-red-500")}>
          {isPaid ? "Payment Successful" : "Pending payment"}
        </p>
      </div>
    </div>
  );
};
