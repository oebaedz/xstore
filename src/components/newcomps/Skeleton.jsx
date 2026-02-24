export default function Skeleton({ className }) {
  return (
    <div className={`animate-pulse bg-gray-200 rounded-sm ${className}`}>
      <div className="h-full w-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full animate-[shimmer_1.5s_infinite]" />
    </div>
  );
}