import Image from "next/image";

export default function ProfileWindow() {
  return (
    <div className="flex h-[220px] items-center justify-center bg-slate-50 md:h-[220px]">
      <Image
        src="/me.png"
        alt="Profile photo"
        width={220}
        height={220}
        className="h-auto max-h-[220px] w-auto object-contain md:max-h-[220px]"
      />
    </div>
  );
}