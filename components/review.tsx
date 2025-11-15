
import { Fragment } from "react";
import Image from "next/image";

type ReviewProps = {
    name: string;
    username: string;
    review: string;
    rating: number;
    date: string;
};

export const StarRating = ({ rating }: { rating: number }) => {
    return (
        <div className="flex gap-1">
            {Array.from({ length: 5 }, (_, index) => (
                <Fragment key={index}>
                    <Image
                        src={index < Math.floor(rating) ? "/star-fill.svg" : index < rating ? "/star-half.svg" : "/star.svg"}
                        alt={index < Math.floor(rating) ? "Filled Star" : index < rating ? "Half Star" : "Empty Star"}
                        width={16}
                        height={16}
                    />
                </Fragment>
            ))}
        </div>
    )
}


const Review = ({ review, rating, name, username, date }: ReviewProps) => {
    return (
        <div className="py-6">
            <h2 className="text-body-medium">{name}</h2>
            <div className="flex flex-row justify-between mb-4">
                <StarRating rating={rating} />
                <span className="text-dark-700 ml-2">{username} - {date}</span>
            </div>
            <div>
                <p className="text-body text-dark-800">{review}</p>
            </div>
        </div>
    );
};

export default Review;
