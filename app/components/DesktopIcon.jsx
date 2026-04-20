export default function DesktopIcon({ label, icon: Icon, color, onClick }) {
  return (
    <button
      onClick={onClick}
      className="flex w-28 flex-col items-center gap-3 rounded-3xl p-2 text-slate-800 transition hover:bg-white/40 lg:w-32 2xl:w-36"
    >
      <div className={`flex h-24 w-24 items-center justify-center rounded-[1.75rem] ${color} shadow-sm lg:h-28 lg:w-28 lg:rounded-[2rem] 2xl:h-32 2xl:w-32 2xl:rounded-[2.25rem]`}>
        <Icon className="h-14 w-14 lg:h-16 lg:w-16 2xl:h-20 2xl:w-20" />
      </div>

      <div className="text-center">
        <p className="text-sm font-semibold leading-tight lg:text-base">{label}</p>
      </div>
    </button>
  );
}
