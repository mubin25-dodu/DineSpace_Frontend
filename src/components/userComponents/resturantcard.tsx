import { api } from "@/lib/api/axios";
import SpotlightCard from "@/components/SpotlightCard";
import { Restaurant } from "@/lib/interfaces/order";
import { Clock3, CreditCard, Mail, MapPin, Phone } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

function getFileUrl(path?: string | null) {
  if (!path) {
    return "/brokenOrderImage.jpg";
  }

  const normalizedPath = path.replace(/\\/g, "/");
  return encodeURI(
    normalizedPath.startsWith("http")
      ? normalizedPath
      : `${api.defaults.baseURL?.replace(/\/$/, "")}/${normalizedPath.replace(/^\//, "")}`,
  );
}

export default function ResturantCard({
  resturant,
}: {
  resturant: Restaurant;
}) {
  const coverPath = resturant.coverFile?.Path ?? resturant.files?.[0]?.Path;
  const logoPath = resturant.logoFile?.Path ?? resturant.files?.[0]?.Path;

  return (
    <SpotlightCard className="h-fit w-full transition hover:-translate-y-1 md:max-w-[360px] lg:max-w-[375px] sm:max-w-[390px]">
      <div className="relative h-36 w-full bg-[#f3e9df]">
        <Image
          src={getFileUrl(coverPath)}
          fill
          sizes="(max-width: 640px) 100vw, 390px"
          alt={`${resturant.resturantName} cover`}
          className="object-cover"
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/55 via-transparent to-transparent" />
        <span
          className={`absolute right-4 top-4 rounded-full px-3 py-1 text-xs font-semibold ${
            resturant.isopen
              ? "bg-emerald-100 text-emerald-800"
              : "bg-white/90 text-gray-700"
          }`}
        >
          {resturant.isopen ? "Open now" : "Closed"}
        </span>
        <div className="absolute -bottom-8 left-4 flex h-16 w-16 items-center justify-center overflow-hidden rounded-xl border-4 border-white bg-[#f8efe7] shadow-md">
          <Image
            src={getFileUrl(logoPath)}
            fill
            sizes="64px"
            alt={`${resturant.resturantName} logo`}
            className="object-cover"
          />
        </div>
      </div>

      <div className="px-4 pb-3 pt-9">
        <h2 className="truncate text-lg font-semibold tracking-tight text-[#291812]">
          {resturant.resturantName}
        </h2>

        <div className="mt-2.5 grid grid-cols-2 gap-2">
          <div className="col-span-2 flex min-h-9 min-w-0 items-center gap-2 rounded-lg bg-[#fbf5f1] px-2 py-1.5 text-xs text-[#6d514b]">
            <span className="flex size-6 shrink-0 items-center justify-center rounded-md bg-white text-[#A13924] shadow-sm">
              <MapPin size={14} aria-hidden="true" />
            </span>
            <span className="truncate">{resturant.address}</span>
          </div>
          <div className="flex min-h-12 min-w-0 items-center gap-2 rounded-lg border border-[#f0e2dc] bg-white px-2 py-1.5 text-xs text-[#6d514b]">
            <span className="flex size-6 shrink-0 items-center justify-center rounded-md bg-[#f8e9e4] text-[#A13924]">
              <Clock3 size={14} aria-hidden="true" />
            </span>
            <span className="min-w-0">
              <span className="block text-[9px] font-semibold uppercase tracking-wide text-[#9a8178]">Hours</span>
              <span className="block truncate font-medium text-[#4b3731]">{resturant.opening} - {resturant.closing}</span>
            </span>
          </div>
          <div className="flex min-h-12 min-w-0 items-center gap-2 rounded-lg border border-[#f0e2dc] bg-white px-2 py-1.5 text-xs text-[#6d514b]">
            <span className="flex size-6 shrink-0 items-center justify-center rounded-md bg-[#f8e9e4] text-[#A13924]">
              <Phone size={14} aria-hidden="true" />
            </span>
            <a
              href={`tel:${resturant.phone}`}
              className="min-w-0 truncate font-medium text-[#8d351f] hover:underline"
            >
              {resturant.phone}
            </a>
          </div>
          <div className="col-span-2 flex min-h-6 min-w-0 items-center gap-2 px-1 text-xs text-[#806f6b]">
            <Mail size={14} className="shrink-0 text-[#A13924]" aria-hidden="true" />
            <span className="truncate">{resturant.resturantemail}</span>
          </div>
        </div>

        <div className="mt-2.5 flex items-center justify-between gap-3 border-t border-[#eee3da] pt-2.5">
          <span className="flex min-w-0 items-center gap-1.5 text-[11px] font-semibold text-[#8d351f]">
            <CreditCard size={13} aria-hidden="true" />
            <span className="truncate">{resturant.payfirst ? "Pay before meal" : "Pay after meal"}</span>
          </span>
          <Link
            href={`/user/Resturant/${resturant.id}`}
            className="shrink-0 rounded-lg bg-[#8d351f] px-3.5 py-2 text-center text-xs font-semibold text-white transition hover:bg-[#702a1a]"
          >
            View restaurant
          </Link>
        </div>
      </div>
    </SpotlightCard>
  );
}
