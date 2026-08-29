"use client";

import { OrderStatus } from "@/lib/Enums";
import { Order } from "@/lib/interfaces/order";

interface OrderFilterProps {
    value: string;
    orders: Order[];
    onChange: (value: string) => void;
}

export default function OrderFilter({ value, orders, onChange }: OrderFilterProps) {
    const options = [
        { title: "All", count: orders.length },
        { title: OrderStatus.Canceled, count: orders.filter((e) => e.OrderStatus === OrderStatus.Canceled).length },
        { title: OrderStatus.Pending, count: orders.filter((e) => e.OrderStatus === OrderStatus.Pending).length },
        { title: OrderStatus.Completed, count: orders.filter((e) => e.OrderStatus === OrderStatus.Completed).length },
    ];

    return (
        <div className="inline-flex rounded-lg bg-[#F5F3F0] p-1" role="tablist" aria-label="Order filter">
            {options.map((option) => {
                const selected = option.title === value;

                return (
                    <button
                        key={option.title}
                        type="button"
                        role="tab"
                        aria-selected={selected}
                        onClick={() => onChange(option.title)}
                        className={`rounded-md px-4 py-1 text-xs transition-colors duration-200 ${
                            selected
                                ? "bg-white font-semibold text-[#A13924] shadow-sm"
                                : "text-[#646468] hover:text-[#A13924]"
                        }`}>
                        {option.title.toUpperCase()} <span className="ml-1 text-[#A13924]">({option.count})</span>
                    </button>
                );
            })}
        </div>
    );
}