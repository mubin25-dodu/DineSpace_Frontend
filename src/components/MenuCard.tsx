"use client";

import { api } from "@/lib/api/axios";
import { MenuItem } from "@/lib/interfaces/order";
import { motion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { PenLine, Trash } from "lucide-react";

interface MenuCardProps {
  item: MenuItem;
  index: number;
  onAvailabilityChange: (available: boolean, id: string) => void;
  onDelete: (id: string) => void;
}

export default function MenuCard({
  item,
  index,
  onAvailabilityChange,
  onDelete,
}: MenuCardProps) {
  const imagePath = item.images?.[0]?.Path?.replace(/\\/g, "/");
  const imageSrc = imagePath
    ? encodeURI(
        imagePath.startsWith("http")
          ? imagePath
          : `${api.defaults.baseURL?.replace(/\/$/, "")}/${imagePath.replace(/^\//, "")}`,
      )
    : "/brokenOrderImage.jpg";

  return (
    <motion.article
      initial={{ opacity: 0, y: 18, scale: 0.96 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, amount: 0.15 }}
      whileHover={{ y: -4, scale: 1.02 }}
      whileTap={{ scale: 0.99 }}
      transition={{
        duration: 0.45,
        delay: Math.min(index * 0.06, 0.36),
        type: "spring",
        stiffness: 130,
        damping: 16,
      }}
      className={`group overflow-hidden rounded-2xl border bg-white shadow-sm hover:border-[#A13924] hover:shadow-xl motion-reduce:transition-none ${
        item.isAvailable
          ? "border-[#dec0ba]"
          : "border-[#f0c3b9] bg-[#fffaf8]"
      }`}
    >
      <div className="relative h-40 w-full overflow-hidden bg-[#f3efed]">
        <Image
          src={imageSrc}
          alt={item.itemName}
          className="object-cover transition-transform duration-500 ease-out group-hover:scale-105 motion-reduce:transition-none"
          quality={85}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
        <span
          className={`absolute left-3 top-3 rounded-full px-3 py-1 text-xs font-semibold ${
            item.isAvailable
              ? "bg-[#dcfce7] text-[#166534]"
              : "bg-[#fee2e2] text-[#991b1b]"
          }`}
        >
          {item.isAvailable ? "Available" : "Not available"}
        </span>
      </div>

      <div className="flex min-h-48 flex-col p-3">
        <div className="mb-1.5 flex items-start justify-between gap-2">
          <h2 className="min-w-0 text-lg font-semibold leading-6 text-[#28211e]">
            {item.itemName}
          </h2>
          <span className="shrink-0 text-lg font-bold text-[#A13924]">
            {Number(item.price).toFixed(2)} BDT
          </span>
        </div>

        <span className="mb-2 w-fit rounded-full bg-[#f3efed] px-2.5 py-1 text-xs font-medium text-[#554742]">
          {item.catagory}
        </span>

        <p className="mb-3 line-clamp-3 text-sm leading-5 text-[#654f48]">
          {item.description || "No description provided."}
        </p>

        <div className="mt-auto flex items-center justify-between gap-2 border-t border-[#ead9d4] pt-2">
          <button
            type="button"
            role="switch"
            aria-checked={Boolean(item.isAvailable)}
            aria-label={`${item.isAvailable ? "Mark" : "Make"} ${item.itemName} ${item.isAvailable ? "unavailable" : "available"}`}
            onClick={() =>
              onAvailabilityChange(!item.isAvailable, item.id)
            }
            className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#A13924] focus-visible:ring-offset-2 ${
              item.isAvailable ? "bg-[#A13924]" : "bg-[#b7aaa5]"
            }`}
          >
            <span
              className={`inline-block h-4 w-4 rounded-full bg-white shadow transition-transform ${
                item.isAvailable ? "translate-x-6" : "translate-x-1"
              }`}
            />
          </button>

          <div className="flex items-center gap-2 text-[#A13924]">
            <button
              type="button"
              onClick={() => onDelete(item.id)}
              aria-label={`Delete ${item.itemName}`}
              className="rounded-lg p-2 transition-colors hover:bg-[#fff1ee] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#A13924]"
            >
              <Trash size={18} strokeWidth={2.5} />
            </button>
            <Link
              href={`menu/edit/${item.id}`}
              aria-label={`Edit ${item.itemName}`}
              className="rounded-lg p-2 transition-colors hover:bg-[#fff1ee] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#A13924]"
            >
              <PenLine size={18} strokeWidth={2.5} />
            </Link>
          </div>
        </div>
      </div>
    </motion.article>
  );
}
