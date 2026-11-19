// Formats times
export const formatTime = (date: Date) =>
  date.toLocaleTimeString("en-AU", { hour: "numeric", minute: "2-digit" }).toLowerCase();

// "today 7:00 pm", "tomorrow 7:00 pm" or "Friday 7:00 pm"
export const formatWhen = (iso: string) => {
  const date = new Date(iso);
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const day =
    date.toDateString() === new Date().toDateString()
      ? "today"
      : date.toDateString() === tomorrow.toDateString()
        ? "tomorrow"
        : date.toLocaleDateString("en-AU", { weekday: "long" });
  return `${day} ${formatTime(date)}`;
};

// Show relative timestamps for posts and comments.
export const timeAgo = (iso: string) => {
  const minutes = Math.floor((Date.now() - new Date(iso).getTime()) / 60000);
  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes}m ago`;
  if (minutes < 24 * 60) return `${Math.floor(minutes / 60)}h ago`;
  return `${Math.floor(minutes / (24 * 60))}d ago`;
};
