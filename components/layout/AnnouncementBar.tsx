import Link from "next/link";

export function AnnouncementBar() {
  return (
    <div className="bg-[#172033] text-white">
      <div className="mx-auto flex max-w-7xl items-center justify-center gap-2 px-4 py-2 text-center text-xs sm:text-sm">
        <span>Free shipping on orders over $75 this week.</span>
        <Link href="/shop" className="font-semibold underline underline-offset-2">
          Shop now
        </Link>
      </div>
    </div>
  );
}
