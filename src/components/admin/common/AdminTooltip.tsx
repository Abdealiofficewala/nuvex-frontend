"use client";

import {
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/utils";

type TooltipPlacement = "top" | "bottom";

type AdminTooltipProps = {
  label: string;
  children: ReactNode;
  className?: string;
  placement?: TooltipPlacement;
};

type TooltipCoords = {
  top: number;
  left: number;
  placement: TooltipPlacement;
  ready: boolean;
};

const VIEWPORT_PADDING = 12;
const TOOLTIP_GAP = 8;

function getAnchorElement(wrapper: HTMLElement): HTMLElement {
  if (
    wrapper.classList.contains("admin-tooltip-trigger--block") ||
    wrapper.classList.contains("admin-tooltip-trigger--fit")
  ) {
    const child = wrapper.firstElementChild;
    if (child instanceof HTMLElement) {
      return child;
    }
  }

  const focusable = wrapper.querySelector<HTMLElement>("a, button, [tabindex]:not([tabindex='-1'])");
  return focusable ?? wrapper;
}

export function AdminTooltip({
  label,
  children,
  className,
  placement = "top",
}: AdminTooltipProps) {
  const [visible, setVisible] = useState(false);
  const [coords, setCoords] = useState<TooltipCoords>({
    top: 0,
    left: 0,
    placement,
    ready: false,
  });
  const triggerRef = useRef<HTMLSpanElement>(null);
  const bubbleRef = useRef<HTMLSpanElement>(null);
  const tooltipId = useId();
  const trimmedLabel = label?.trim() ?? "";

  const updatePosition = useCallback(() => {
    const wrapper = triggerRef.current;
    if (!wrapper || !trimmedLabel) {
      return;
    }

    const anchor = getAnchorElement(wrapper);
    const rect = anchor.getBoundingClientRect();
    const bubble = bubbleRef.current;
    const bubbleWidth = bubble?.offsetWidth ?? 0;
    const bubbleHeight = bubble?.offsetHeight ?? 0;

    let resolvedPlacement = placement;
    const spaceAbove = rect.top;
    const spaceBelow = window.innerHeight - rect.bottom;

    if (
      placement === "top" &&
      bubbleHeight > 0 &&
      spaceAbove < bubbleHeight + TOOLTIP_GAP + VIEWPORT_PADDING &&
      spaceBelow > spaceAbove
    ) {
      resolvedPlacement = "bottom";
    } else if (
      placement === "bottom" &&
      bubbleHeight > 0 &&
      spaceBelow < bubbleHeight + TOOLTIP_GAP + VIEWPORT_PADDING &&
      spaceAbove > spaceBelow
    ) {
      resolvedPlacement = "top";
    }

    const halfWidth = bubbleWidth / 2;
    const left = Math.max(
      VIEWPORT_PADDING + halfWidth,
      Math.min(window.innerWidth - VIEWPORT_PADDING - halfWidth, rect.left + rect.width / 2),
    );

    const top =
      resolvedPlacement === "top" ? rect.top - TOOLTIP_GAP : rect.bottom + TOOLTIP_GAP;

    setCoords({
      top,
      left,
      placement: resolvedPlacement,
      ready: true,
    });
  }, [trimmedLabel, placement]);

  const show = useCallback(() => {
    if (!trimmedLabel) {
      return;
    }

    setVisible(true);
  }, [trimmedLabel]);

  const hide = useCallback(() => {
    setVisible(false);
    setCoords((current) => ({ ...current, ready: false }));
  }, []);

  useLayoutEffect(() => {
    if (!visible) {
      return;
    }

    updatePosition();
  }, [visible, trimmedLabel, updatePosition]);

  useEffect(() => {
    if (!visible) {
      return;
    }

    const handleReposition = () => updatePosition();
    window.addEventListener("scroll", handleReposition, true);
    window.addEventListener("resize", handleReposition);

    return () => {
      window.removeEventListener("scroll", handleReposition, true);
      window.removeEventListener("resize", handleReposition);
    };
  }, [visible, updatePosition]);

  if (!trimmedLabel) {
    return <>{children}</>;
  }

  return (
    <>
      <span
        ref={triggerRef}
        className={cn("admin-tooltip-trigger", className)}
        onMouseEnter={show}
        onMouseLeave={hide}
        onFocusCapture={show}
        onBlurCapture={hide}
      >
        {children}
      </span>
      {visible
        ? createPortal(
            <span
              ref={bubbleRef}
              id={tooltipId}
              role="tooltip"
              className={cn(
                "admin-tooltip-bubble",
                coords.placement === "bottom" && "admin-tooltip-bubble--bottom",
                !coords.ready && "admin-tooltip-bubble--measuring",
              )}
              style={{
                top: coords.top,
                left: coords.left,
              }}
            >
              {trimmedLabel}
            </span>,
            document.body,
          )
        : null}
    </>
  );
}
