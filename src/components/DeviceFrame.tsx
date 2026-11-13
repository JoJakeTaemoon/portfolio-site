import type { ReactNode } from "react";
import type { Shot } from "@/content/types";

/** Wraps an image in a CSS-only laptop or phone frame. No frame given = children unchanged. */
export function DeviceFrame({ frame, children }: { frame?: Shot["frame"]; children: ReactNode }) {
  if (!frame) return children;
  return (
    <div className="device" data-frame={frame}>
      {children}
    </div>
  );
}
