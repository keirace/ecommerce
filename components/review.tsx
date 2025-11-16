
import { Fragment } from "react";
import Image from "next/image";

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


const Review = ({ comment, rating, name, username, date }: Review) => {
    return (
        <div className="py-6">
            <h2 className="text-body-medium">{name}</h2>
            <div className="flex flex-row justify-between mb-4">
                <StarRating rating={rating} />
                <span className="text-dark-700 ml-2">{username} - {date}</span>
            </div>
            <div>
                <p className="text-body text-dark-800">{comment}</p>
            </div>
        </div>
    );
};

export default Review;
