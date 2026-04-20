import Image from "next/image";

export default function ProfileWindow() {
  return (
    <div className="flex h-[314px] items-center justify-center bg-slate-50">
      <Image
        src="/me.png"
        alt="Profile photo"
        width={300}
        height={300}
        className="h-auto max-h-[300px] w-auto object-contain"
      />
    </div>
  );
}
