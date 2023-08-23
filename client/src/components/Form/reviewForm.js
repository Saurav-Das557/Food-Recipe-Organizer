import React, { useState } from "react";

const ReviewForm = ({ handleSubmit }) => {
  const [rating, setRating] = useState(0); // Initialize with 0 (bad)
  const [text, setText] = useState("");

  const ratingOptions = [
    { value: 0, label: "Bad" },
    { value: 1, label: "Below Average" },
    { value: 2, label: "Average" },
    { value: 3, label: "Good" },
    { value: 4, label: "Very Good" },
    { value: 5, label: "Excellent" },
  ];

  const submitReview = (e) => {
    e.preventDefault();
    handleSubmit({ rating, text });
    // Clear form fields after submission
    setRating(0);
    setText("");
  };

  return (
    <form onSubmit={submitReview}>
      <div className="mb-3">
        <label className="mb-2">Rating: </label>
        <select
          className="form-control"
          value={rating}
          onChange={(e) => setRating(parseInt(e.target.value, 10))}
        >
          {ratingOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.value} - {option.label}
            </option>
          ))}
        </select>
      </div>
      <div className="mb-3">
        <label>Review: </label>
        <textarea
          className="form-control"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Share your thoughts on this recipe"
        ></textarea>
      </div>

      <button type="submit" className="btn btn-success mb-3">
        Submit Review
      </button>
    </form>
  );
};

export default ReviewForm;
