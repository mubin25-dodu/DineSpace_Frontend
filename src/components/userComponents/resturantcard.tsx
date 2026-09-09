import { api } from "@/lib/api/axios";
import { Restaurant } from "@/lib/interfaces/order";
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
    <div className="w-full overflow-hidden rounded-2xl border border-[#eadfd5] bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg sm:max-w-md">
      <div className="relative h-48 w-full bg-[#f3e9df]">
        <Image
          src={getFileUrl(coverPath)}
          fill
          sizes="(max-width: 640px) 100vw, 448px"
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
        <div className="absolute -bottom-10 left-5 flex h-20 w-20 items-center justify-center overflow-hidden rounded-2xl border-4 border-white bg-[#f8efe7] shadow-md">
          <Image
            src={getFileUrl(logoPath)}
            fill
            sizes="80px"
            alt={`${resturant.resturantName} logo`}
            className="object-cover"
          />
        </div>
      </div>

      <div className="px-5 pb-5 pt-14">
        <h2 className="text-xl font-semibold tracking-tight text-black">
          {resturant.resturantName}
        </h2>
        <p className="mt-2 line-clamp-2 text-sm text-gray-600">
          {resturant.address}
        </p>

        <div className="mt-4 grid gap-2 text-sm text-gray-700">
          <p>
            <span className="font-medium text-[#291812]">Hours:</span>{" "}
            {resturant.opening} - {resturant.closing}
          </p>
          <p>
            <span className="font-medium text-[#291812]">Phone:</span>{" "}
            <a
              href={`tel:${resturant.phone}`}
              className="text-[#8d351f] hover:underline"
            >
              {resturant.phone}
            </a>
          </p>
          <p className="truncate">
            <span className="font-medium text-[#291812]">Email:</span>{" "}
            {resturant.resturantemail}
          </p>
        </div>

        <div className="mt-5 border-t border-[#eee3da] pt-4 text-sm font-medium text-[#8d351f]">
          {resturant.payfirst ? "Pay before your meal" : "Pay after your meal"}
        </div>
        <Link
          href={`/user/Resturents/${resturant.id}`}
          className="mt-4 block rounded-lg bg-[#8d351f] px-4 py-3 text-center text-sm font-semibold text-white transition hover:bg-[#702a1a]"
        >
          View restaurant
        </Link>
      </div>
    </div>
  );
}
