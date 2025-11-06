import Image from "next/image"
import Link from "next/link";

interface CardProps {
    title: string;
    subtitle: string;
    imageSrc: string;
    slug: string;
    price: number;
    meta?: string | string[];
    badge?: { label: string; tone?: 'orange' | 'red' | 'green' };
}

interface CardBadgeProps {
    label: string;
    tone?: 'orange' | 'red' | 'green' | undefined;
}

const CardBadge = ({ label, tone }: CardBadgeProps) => {
    const toneClasses = {
        orange: 'bg-orange-100 text-orange-800',
        red: 'bg-red-100 text-red-800',
        green: 'bg-green-100 text-green-800',
        undefined: 'bg-gray-100 text-gray-800',
    };

    return (
        <span className={`inline-block px-2 py-1 text-xs font-semibold rounded-full ${toneClasses[tone ?? 'undefined']}`}>
            {label}
        </span>
    );
};

const Card = ({ title, subtitle, imageSrc, slug, price, meta, badge }: CardProps) => {
    return (
        <Link href={`/product/${slug}`} aria-label={title} className="group rounded-xl bg-light-100 ring-1 ring-light-300 transition-colors hover:ring-dark-500">
            <div className="aspect-square overflow-hidden rounded-t-xl bg-light-200">
                <Image src={imageSrc} alt={title} width={500} height={500} className="object-cover transition-transform duration-300 group-hover:scale-105" sizes="(min-width: 1280px) 360px, (min-width: 1024px) 300px, (min-width: 640px) 45vw, 90vw" />
            </div>
            <div className="p-4">
                {badge && <CardBadge label={badge.label} tone={badge.tone} />}
                <div className="my-3 flex justify-between items-baseline gap-3 text-heading-4 font-jost">
                    <h3>{title}</h3>
                    <p>${price}</p>
                </div>
                <p className="text-sm text-gray-600">{subtitle}</p>
                {meta && <p className="mt-1 text-sm text-light-400">{Array.isArray(meta) ? meta.join(', ') : meta}</p>}
            </div>
        </Link>
    )
}

export default Card