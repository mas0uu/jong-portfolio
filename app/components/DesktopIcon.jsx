export default function DesktopIcon({ label, icon: Icon, color, onClick }) {
  return (
    <button
      onClick={onClick}
      className="flex w-24 flex-col items-center gap-2 rounded-2xl p-2 text-slate-800 transition hover:bg-white/40"
    >
      <div className={`flex h-20 w-20 items-center justify-center rounded-3xl ${color} shadow-sm`}>
        <Icon className="h-9 w-9" />
      </div>

      <div className="text-center">
        <p className="text-sm font-semibold">{label}</p>
      </div>
    </button>
  );
}