import { useState, useEffect } from "react";
import { toast } from "react-toastify";

export const useFavorite = (movieId) => {
    const [isLiked, setIsLiked] = useState(false);
    const [isAuthorized, setIsAuthorized] = useState(false);

    useEffect(() => {
        const currentUser = JSON.parse(localStorage.getItem("currentUser") || "null");
        setIsAuthorized(!!currentUser);
    }, []);

    useEffect(() => {
        if (!movieId || !isAuthorized) return;
        const favoriteKey = `favorite_movie_${movieId}`;
        const isFav = localStorage.getItem(favoriteKey) === "true";
        setIsLiked(isFav);
    }, [movieId, isAuthorized]);

    const toggleLike = () => {
        if (!isAuthorized) {
            toast.info("Щоб додати до улюблених, увійдіть у акаунт 😇", {
                position: "top-center",
                autoClose: 3000,
            });
            return;
        }
        const favoriteKey = `favorite_movie_${movieId}`;
        const newLikedStatus = !isLiked;
        setIsLiked(newLikedStatus);
        localStorage.setItem(favoriteKey, String(newLikedStatus));
        toast.success(
            newLikedStatus
                ? "Додано до улюблених ❤️"
                : "Видалено з улюблених 💔",
            {
                position: "top-center",
                autoClose: 2000,
            }
        );
    };

    return { isLiked, toggleLike, isAuthorized };
};
