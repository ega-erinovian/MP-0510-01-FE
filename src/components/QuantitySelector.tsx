"use client";

import { Button } from "@/components/ui/button";

interface QuantitySelectorProps {
  maxValue?: number;
  quantity: number;
  onChangeQuantity: (page: number) => void;
}

export default function QuantitySelector({
  maxValue = 10,
  quantity,
  onChangeQuantity,
}: QuantitySelectorProps) {
  const decreaseQuantity = () => {
    if (quantity > 1) {
      onChangeQuantity(quantity - 1);
    }
  };

  const increaseQuantity = () => {
    if (quantity < maxValue) {
      onChangeQuantity(quantity + 1);
    }
  };

  return (
    <div className="flex items-center gap-3">
      <Button
        variant="outline"
        size="icon"
        className="h-8 w-8 rounded-full"
        onClick={decreaseQuantity}
        disabled={quantity <= 1}>
        -
      </Button>
      <div className="w-8 text-center tabular-nums">{quantity}</div>
      <Button
        variant="outline"
        size="icon"
        className="h-8 w-8 rounded-full"
        onClick={increaseQuantity}
        disabled={quantity >= maxValue}>
        +
      </Button>
    </div>
  );
}
