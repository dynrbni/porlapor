export const colors = {
  primary: "#00236f",
  onPrimary: "#ffffff",
  primaryContainer: "#1e3a8a",
  onPrimaryContainer: "#90a8ff",
  background: "#f8f9ff",
  surface: "#f8f9ff",
  onSurface: "#0b1c30",
  onSurfaceVariant: "#444651",
  outline: "#757682",
  outlineVariant: "#c5c5d3",
  error: "#ba1a1a",
  tertiaryFixed: "#6ffbbe",
  onTertiaryFixed: "#002113",
  secondaryContainer: "#fea619",
  onSecondaryContainer: "#684000",
  secondaryFixed: "#ffddb8",
  onSecondaryFixed: "#2a1700",
  primaryFixed: "#dce1ff",
  onPrimaryFixed: "#00164e",
  warningBg: "#fef3c7",
  warningText: "#92400e",
  warningBorder: "#fde68a",
} as const;

export const statusLabels: Record<string, string> = {
  PENDING: "Menunggu",
  IN_REVIEW: "Ditinjau",
  IN_PROGRESS: "Diproses",
  RESOLVED: "Selesai",
  REJECTED: "Ditolak",
};

export function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Baru saja";
  if (mins < 60) return `${mins} menit yang lalu`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs} jam yang lalu`;
  const days = Math.floor(hrs / 24);
  return `${days} hari yang lalu`;
}

export function getCategoryBadgeStyle(name?: string) {
  const n = (name || "").toLowerCase();
  if (n.includes("infrastruktur") || n.includes("jalan")) {
    return { bg: "bg-secondary-fixed", text: "text-on-secondary-fixed" };
  }
  if (n.includes("lingkungan") || n.includes("kebersihan")) {
    return { bg: "bg-surface-variant", text: "text-on-surface-variant" };
  }
  if (n.includes("ketertiban")) {
    return { bg: "bg-primary-fixed", text: "text-on-primary-fixed" };
  }
  return { bg: "bg-surface-variant", text: "text-on-surface-variant" };
}

export function getStatusBadgeStyle(status: string) {
  const s = status.toUpperCase();
  switch (s) {
    case "IN_PROGRESS":
      return {
        bg: "bg-secondary-container",
        text: "text-on-secondary-container",
        iconColor: colors.onSecondaryContainer,
      };
    case "RESOLVED":
      return {
        bg: "bg-tertiary-fixed",
        text: "text-on-tertiary-fixed",
        iconColor: colors.onTertiaryFixed,
      };
    case "REJECTED":
      return {
        bg: "bg-error-container",
        text: "text-on-error-container",
        iconColor: colors.error,
      };
    default:
      return {
        bg: "bg-surface-variant",
        text: "text-on-surface-variant",
        iconColor: colors.onSurfaceVariant,
      };
  }
}
