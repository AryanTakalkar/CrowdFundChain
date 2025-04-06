import React, { useState, useEffect } from "react";
import { Star } from "lucide-react"; // Using Lucide icons for stars

const Comments = ({ campaignId }) => {
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState("");
    const [rating, setRating] = useState(0);

    useEffect(() => {
        const storedComments = JSON.parse(localStorage.getItem(`comments-${campaignId}`)) || [];
        setComments(storedComments);
    }, [campaignId]);

    const handleAddComment = () => {
        if (!newComment.trim() || rating === 0) {
            alert("Please enter a comment and select a rating.");
            return;
        }

        const updatedComments = [
            ...comments, 
            { text: newComment, rating, date: new Date().toLocaleString() }
        ];
        
        setComments(updatedComments);
        localStorage.setItem(`comments-${campaignId}`, JSON.stringify(updatedComments));
        setNewComment("");
        setRating(0);
    };

    return (
        <div className="mt-10">
            <h3 className="text-lg font-semibold mb-4">Reviews & Discussion</h3>

            {/* ⭐ Star Rating Input */}
            <div className="mb-2 flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                        key={star}
                        className={`h-6 w-6 cursor-pointer ${
                            star <= rating ? "text-yellow-500 fill-yellow-500" : "text-gray-400"
                        }`}
                        onClick={() => setRating(star)}
                    />
                ))}
            </div>

            {/* ✍️ Comment Input */}
            <div className="mb-4">
                <textarea
                    className="w-full p-2 border rounded dark:text-black dark:bg-gray-400"
                    placeholder="Leave a review..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                ></textarea>
                <button 
                    className="mt-2 px-4 py-2 bg-primary text-white rounded"
                    onClick={handleAddComment}
                >
                    Post Review
                </button>
            </div>

            {/* 📝 Display Reviews */}
            <div>
                {comments.length > 0 ? (
                    comments.map((comment, index) => (
                        <div key={index} className="border-b py-2">
                            {/* ⭐ Display Rating */}
                            <div className="flex gap-1">
                                {[...Array(comment.rating)].map((_, i) => (
                                    <Star key={i} className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                                ))}
                            </div>
                            <p>{comment.text}</p>
                            <span className="text-xs text-gray-500">{comment.date}</span>
                        </div>
                    ))
                ) : (
                    <p className="text-gray-500">No reviews yet. Be the first to review!</p>
                )}
            </div>
        </div>
    );
};

export default Comments;
