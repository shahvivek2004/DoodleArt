import { type JSX } from "react";

export function Card({
  title,
  children,
  img,
  alt,
}: {
  title: string;
  children: React.ReactNode;
  img: string;
  alt: string;
}): JSX.Element {
  return (
    <div className="flex flex-col border border-gray-400 rounded-2xl p-5 gap-1">
      <div className="flex items-center gap-2 mb-2">
        <div className="w-8 h-8 flex items-center justify-center">
          <img
            src={`/${img}`}
            alt={alt}
            width={28}
            height={28}
            draggable="false"
          />
        </div>
        <h2 className="text-xl font-semibold">{title}</h2>
      </div>
      <p className="text-left">{children}</p>
    </div>
  );
}
