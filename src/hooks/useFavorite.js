import { useState, useEffect } from "react";

export const useFavorite = (movieId) => {
    const [isLiked, setIsLiked] = useState(false);

    useEffect(() => {
        if (!movieId) return;
        const favoriteKey = `favorite_movie_${movieId}`;
        const isFav = localStorage.getItem(favoriteKey) === "true";
        setIsLiked(isFav);
    }, [movieId]);

    const toggleLike = () => {
        const favoriteKey = `favorite_movie_${movieId}`;
        const newLikedStatus = !isLiked;
        setIsLiked(newLikedStatus);
        localStorage.setItem(favoriteKey, String(newLikedStatus));
    };

    return { isLiked, toggleLike };
};
