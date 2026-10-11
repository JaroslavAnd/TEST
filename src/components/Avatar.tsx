import { getInitials } from "@/lib/format";

interface AvatarProps {
  name?: string | null;
  image?: string | null;
  size?: number;
}

// Аватар: фото або ініціали на синьому «чорнилі»
export default function Avatar({ name, image, size = 32 }: AvatarProps) {
  const style = { width: size, height: size, fontSize: Math.round(size * 0.4) };

  if (image) {
    // Аватари приходять із різних OAuth-доменів, тому next/image тут не використовуємо
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={image}
        alt=""
        style={style}
        className="rounded-full object-cover shrink-0 bg-slate-100"
      />
    );
  }

  return (
    <span
      aria-hidden="true"
      style={style}
      className="inline-flex items-center justify-center rounded-full bg-ink text-white font-semibold shrink-0 select-none"
    >
      {getInitials(name)}
    </span>
  );
}
