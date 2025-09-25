import React, { createContext, useContext, useState, useEffect } from 'react';
import { Review } from '../types';

const REVIEWS_KEY = 'desparches_reviews';

interface ReviewsContextType {
    reviews: Review[];
    addReview: (reviewData: Omit<Review, 'id' | 'timestamp' | 'userId'>, userId: string) => Promise<void>;
    getUserReview: (userId: string) => Review | undefined;
}

const ReviewsContext = createContext<ReviewsContextType>({
    reviews: [],
    addReview: async () => {},
    getUserReview: () => undefined,
});

export const ReviewsProvider = ({ children }: React.PropsWithChildren<{}>) => {
    const [reviews, setReviews] = useState<Review[]>([]);

    useEffect(() => {
        try {
            const reviewsJson = localStorage.getItem(REVIEWS_KEY);
            if (reviewsJson) {
                setReviews(JSON.parse(reviewsJson));
            }
        } catch (error) {
            console.error("Failed to load reviews from localStorage:", error);
        }
    }, []);

    const addReview = async (reviewData: Omit<Review, 'id' | 'timestamp' | 'userId'>, userId: string) => {
        const newReview: Review = {
            id: `review_${userId}_${Date.now()}`,
            userId,
            timestamp: new Date().toISOString(),
            ...reviewData
        };
        
        // Users can only have one review, so we replace if it exists
        const otherReviews = reviews.filter(r => r.userId !== userId);
        const updatedReviews = [...otherReviews, newReview];
        
        setReviews(updatedReviews);
        localStorage.setItem(REVIEWS_KEY, JSON.stringify(updatedReviews));
    };

    const getUserReview = (userId: string) => {
        return reviews.find(review => review.userId === userId);
    };

    return (
        <ReviewsContext.Provider value={{ reviews, addReview, getUserReview }}>
            {children}
        </ReviewsContext.Provider>
    );
};

export const useReviews = () => useContext(ReviewsContext);