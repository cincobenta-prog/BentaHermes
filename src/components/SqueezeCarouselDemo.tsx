"use client";

import { SqueezeCarousel, type SqueezeSlide } from "@/components/ui/carousel-squeeze";

export const settings = {
    height: 320,
    gap: 16,
    slatGap: 8,
    slatWidth: 8,
    radius: 6,
    duration: 1000,
    hoverGrow: true,
    autoplay: false,
    interval: 6000,
    controls: true,
};

type DemoProps = Partial<typeof settings>;

/** A wordmark for the corner of the open panel. */
const mark = (text: string) => (
    <span className="text-sm font-medium tracking-tight text-white">{text}</span>
);

const slides: SqueezeSlide[] = [
    {
        id: "program",
        title: "Funeral Programs",
        description:
            "Professional layouts for celebrating a life. AI-powered data porting from Word docs.",
        action: "View Templates",
        overlay: mark("Programs"),
        image: "https://images.unsplash.com/photo-1516589174187-f8777677934f?q=80&w=800&auto=format&fit=crop",
        imageAlt: "Example Funeral Program layout",
    },
    {
        id: "prayer-cards",
        title: "Prayer Cards",
        description:
            "Elegant, compact keepsakes. Fast turnaround with precision formatting.",
        action: "View Templates",
        overlay: mark("Prayer Cards"),
        image: "https://images.unsplash.com/photo-1544427920-c49709075773?q=80&w=800&auto=format&fit=crop",
        imageAlt: "Example Prayer Card layout",
    },
    {
        id: "thank-you",
        title: "Thank You Cards",
        description:
            "Graceful expressions of gratitude. Personalized templates for every family.",
        action: "View Templates",
        overlay: mark("Thank You"),
        image: "https://images.unsplash.com/photo-1516627145494-72c70b946b60?q=80&w=800&auto=format&fit=crop",
        imageAlt: "Example Thank You card layout",
    },
];

export default function SqueezeCarouselDemo(props: DemoProps) {
    const options = { ...settings, ...props };

    return (
        <div className="bg-background w-full px-6 py-10">
            <SqueezeCarousel slides={slides} label="Our Digital Assets" {...options} />
        </div>
    );
}
