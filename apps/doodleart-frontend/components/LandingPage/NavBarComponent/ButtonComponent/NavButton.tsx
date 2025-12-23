"use client";
import { useRouter } from "next/navigation";
import { ReactNode } from "react";

export default function NavButton({
  children,
  route,
  style,
}: {
  children: ReactNode;
  route: string;
  style: string;
}) {
  const router = useRouter();
  return (
    <button
      className={style}
      onClick={() => {
        router.push(route);
      }}
    >
      {children}
    </button>
  );
}
