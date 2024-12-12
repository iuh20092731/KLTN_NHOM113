import React from "react";
import { Star } from "lucide-react"

interface RatingProps {
  rating: number;
  reviews: number;
}

const Rating: React.FC<RatingProps> = ({ rating, reviews }) => {
  return (
    <div className="flex items-center justify-start md:justify-start">
      <span className="text-sm md:text-base text-gray-600 mr-1">{rating}</span>
      <div className="flex">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            size={16}
            className={`${
              i < Math.floor(rating) ? "text-yellow-400 fill-current" : "text-gray-300"
            }`}
          />
        ))}
      </div>
      <span className="text-sm md:text-base text-gray-500 ml-1">({reviews})</span>
    </div>
  );
};

export default Rating;
