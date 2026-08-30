import Image from "next/image";

type MediaFillProps = {
  src?: string;
  alt?: string;
  sizes?: string;
  className?: string;
  priority?: boolean;
};

export function MediaFill({ src, alt = "", sizes = "50vw", className, priority }: MediaFillProps) {
  if (!src) {
    return null;
  }

  return (
    <div className={className ?? "media-fill"}>
      <Image src={src} alt={alt} fill sizes={sizes} quality={75} priority={priority} />
    </div>
  );
}
