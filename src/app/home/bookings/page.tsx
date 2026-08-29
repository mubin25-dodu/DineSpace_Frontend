export default function BookingsPage() {
    return <SectionPlaceholder title="Bookings" />;
}

function SectionPlaceholder({ title }: { title: string }) {
    return <h1 className="p-8 text-3xl font-semibold text-[#27221E]">{title}</h1>;
}
