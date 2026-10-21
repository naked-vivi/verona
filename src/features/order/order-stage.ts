// * The API only returns a status and an ETA, so the stage is derived from both

export type Stage = "preparing" | "on-the-way" | "late" | "delivered";

export function getStage(status: string | undefined, msLeft: number): Stage {
  if (status === "delivered") return "delivered";
  if (msLeft <= 0) return "late";
  if (status === "preparing") return "preparing";
  return "on-the-way";
}

export const STAGE_LABELS: Record<Stage, string> = {
  preparing: "In the oven",
  "on-the-way": "On its way",
  late: "Should have arrived",
  delivered: "Delivered",
};

export function isFinished(stage: Stage) {
  return stage === "delivered" || stage === "late";
}

export function formatTime(dateStr: string) {
  return new Intl.DateTimeFormat("en", { hour: "2-digit", minute: "2-digit" }).format(new Date(dateStr));
}

export function formatCountdown(ms: number) {
  const total = Math.max(0, Math.floor(ms / 1000));
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = String(total % 60).padStart(2, "0");
  return h > 0 ? `${h}:${String(m).padStart(2, "0")}:${s}` : `${m}:${s}`;
}
