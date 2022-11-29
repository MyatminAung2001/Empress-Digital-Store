import React from 'react';

const Rating = ({ rating, numberOfReviews, caption }) => {
    return (
        <div className="flex items-center gap-x-1">
            <span className="text-[#ffb703]">
                <i
                className={
                    rating >= 1
                    ? 'fas fa-star'
                    : rating >= 0.5
                    ? 'fas fa-star-half-alt'
                    : 'far fa-star'
                }
                />
            </span>
            <span className="text-[#ffb703]">
                <i
                className={
                    rating >= 2
                    ? 'fas fa-star'
                    : rating >= 1.5
                    ? 'fas fa-star-half-alt'
                    : 'far fa-star'
                }
                />
            </span>
            <span className="text-[#ffb703]">
                <i
                className={
                    rating >= 3
                    ? 'fas fa-star'
                    : rating >= 2.5
                    ? 'fas fa-star-half-alt'
                    : 'far fa-star'
                }
                />
            </span>
            <span className="text-[#ffb703]">
                <i
                className={
                    rating >= 4
                    ? 'fas fa-star'
                    : rating >= 3.5
                    ? 'fas fa-star-half-alt'
                    : 'far fa-star'
                }
                />
            </span>
            <span className="text-[#ffb703]">
                <i
                className={
                    rating >= 5
                    ? 'fas fa-star'
                    : rating >= 4.5
                    ? 'fas fa-star-half-alt'
                    : 'far fa-star'
                }
                />
            </span>
            {
                caption ? (
                    <span>
                        {caption}
                    </span>
                ) : (
                    <span>
                        {'reviews: ' + numberOfReviews + '' }
                    </span> 
                )
            }
        </div>
    )
};

export default Rating;