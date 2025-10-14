import Image from "next/image";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import Link from "next/link";

const sizes = {
  xs: "w-16 h-5",
  sm: "w-20 h-6",
  md: "w-24 h-[30px]",
  lg: "w-28 h-8",
  xl: "w-32 h-10",
};

interface LogoProps {
  size?: keyof typeof sizes;
}

export default function Logo({ size = "md" }: LogoProps) {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <Link href="/" className={`${sizes[size]} flex items-center`}>
        <Image
          src="/assets/logo/argu_x_logo.svg"
          alt="ArguX logo"
          width={2000}
          height={609}
          className="w-full h-full object-contain"
          style={{ width: "auto", height: "auto" }}
        />
      </Link>
    );
  }

  return (
    <Link href="/" className={`${sizes[size]} flex items-center`}>
      <Image
        src={theme === "dark" ? "/assets/logo/argu_x_logo_dark.svg" : "/assets/logo/argu_x_logo.svg"}
        alt="ArguX logo"
        width={2000}
        height={609}
        className="w-full h-full object-contain"
        style={{ width: "auto", height: "auto" }}
      />
    </Link>
  );
}