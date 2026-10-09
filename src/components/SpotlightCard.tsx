"use client";

import { CSSProperties, HTMLAttributes, ReactNode, useRef } from "react";

interface SpotlightCardProps extends HTMLAttributes<HTMLDivElement> {
    children: ReactNode;
    spotlightColor?: string;
    spotlightSize?: number;
    className?: string;
}

export default function SpotlightCard({
    children,
    spotlightColor = "#A13924",
    spotlightSize = 260,
    className = "",
    style,
    onPointerMove,
    onPointerLeave,
    ...rest
}: SpotlightCardProps) {
    const cardRef = useRef<HTMLDivElement>(null);

    const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
        const card = cardRef.current;
        if (card) {
            const bounds = card.getBoundingClientRect();
            card.style.setProperty("--spotlight-x", `${event.clientX - bounds.left}px`);
            card.style.setProperty("--spotlight-y", `${event.clientY - bounds.top}px`);
            card.style.setProperty("--spotlight-opacity", "1");
        }
        onPointerMove?.(event);
    };

    const handlePointerLeave = (event: React.PointerEvent<HTMLDivElement>) => {
        cardRef.current?.style.setProperty("--spotlight-opacity", "0");
        onPointerLeave?.(event);
    };

    return (
        <div
            ref={cardRef}
            className={`group relative isolate overflow-hidden rounded-3xl border border-[#18181b]/10 bg-white shadow-[0_1px_2px_rgba(24,24,27,0.04),0_18px_40px_-20px_rgba(24,24,27,0.16)] ${className}`}
            style={
                {
                    "--spotlight-color": spotlightColor,
                    "--spotlight-size": `${spotlightSize}px`,
                    "--spotlight-x": "50%",
                    "--spotlight-y": "0%",
                    "--spotlight-opacity": "0",
                    ...style,
                } as CSSProperties
            }
            onPointerMove={handlePointerMove}
            onPointerLeave={handlePointerLeave}
            {...rest}
        >
            <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 z-10 rounded-[inherit] opacity-[var(--spotlight-opacity)] transition-opacity duration-300"
                style={{
                    background:
                        "radial-gradient(circle var(--spotlight-size) at var(--spotlight-x) var(--spotlight-y), color-mix(in srgb, var(--spotlight-color) 22%, transparent), transparent 70%)",
                }}
            />
            <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 z-20 rounded-[inherit] p-px opacity-[var(--spotlight-opacity)]"
                style={{
                    background:
                        "radial-gradient(circle 180px at var(--spotlight-x) var(--spotlight-y), color-mix(in srgb, var(--spotlight-color) 65%, transparent), transparent 70%)",
                    mask: "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
                    maskComposite: "exclude",
                }}
            />
            <div className="relative z-[1]">{children}</div>
        </div>
    );
}
