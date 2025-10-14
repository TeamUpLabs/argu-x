import Image from "next/image";
import { useTheme } from "next-themes";

const sizes = {
  sm: { width: 80, height: 24.36 },
  md: { width: 100, height: 30.45 },
  lg: { width: 120, height: 36.54 },
};

interface LogoProps {
  size?: keyof typeof sizes;
}

export default function Logo({ size = "md" }: LogoProps) {
  const { theme } = useTheme();

  return (
    <Image
      src={theme === "dark" ? "/assets/logo/argu_x_logo_dark.svg" : "/assets/logo/argu_x_logo.svg"}
      alt="ArguX logo"
      width={sizes[size].width}
      height={sizes[size].height}
      priority
      className="object-contain"
    />
  );
}