import HatMark from "./HatMark";

const colors: Record<string, string> = {
  figures: "#e8391a",
  apparel: "#0e4a5c",
  posters: "#d9a521",
  accessories: "#3c7a4a",
};

type Props = { image: string; name: string; category: string; className?: string; color?: boolean };

export default function ProductImage({ image, name, category, className = "", color = false }: Props) {
  if (image && image !== "/placeholder.svg") {
    return (
      <img
        src={image}
        alt={name}
        className={`aspect-square w-full object-cover transition duration-500 ${
            color ? "" : "grayscale group-hover:grayscale-0"
        } ${className}`}
      />
    );
  }

  return (
    <div
      role="img"
      aria-label={name}
      className={`halftone relative flex aspect-square w-full items-center justify-center overflow-hidden ${className}`}
      style={{ backgroundColor: colors[category] ?? colors.figures }}
    >
      <span className="pointer-events-none absolute -bottom-3 -left-2 select-none font-display text-[5rem] uppercase leading-none text-transparent [-webkit-text-stroke:2px_rgba(20,17,15,0.35)]">
        {category}
      </span>
      <HatMark className="relative w-1/2 text-ink transition-transform duration-500 ease-out group-hover:-rotate-6 group-hover:scale-110" />
    </div>
  );
}