import { useState } from "react";

interface Props {
  name: string;
  url?: string;
  size?: number;
  className?: string;
}

export function CompanyLogo({ name, url, size = 48, className }: Props) {
  const [errored, setErrored] = useState(false);
  const key = (import.meta as { env?: Record<string, string> }).env?.VITE_LOGO_DEV_PUBLISHABLE_KEY;
  const domain = url?.replace(/^https?:\/\//, "").split("/")[0];
  const src = key && domain
    ? `https://img.logo.dev/${domain}?token=${key}`
    : url;

  if (!errored && src) {
    return (
      <img
        src={src}
        alt={`${name} logo`}
        width={size}
        height={size}
        onError={() => setErrored(true)}
        className={`rounded-lg object-contain bg-white border border-border ${className ?? ""}`}
        style={{ width: size, height: size }}
      />
    );
  }
  return (
    <div
      className={`rounded-lg flex items-center justify-center bg-secondary text-secondary-foreground font-semibold border border-border ${className ?? ""}`}
      style={{ width: size, height: size, fontSize: size * 0.4 }}
    >
      {name.charAt(0).toUpperCase()}
    </div>
  );
}
