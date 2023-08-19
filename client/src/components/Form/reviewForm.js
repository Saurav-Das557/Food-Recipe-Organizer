import React, { useState } from "react";

const ReviewForm = ({ handleSubmit }) => {
  const [rating, setRating] = useState(0);
  const [text, setText] = useState("");

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
        <label>Rating: </label>
        <input
          type="number"
          className="form-control"
          value={rating}
          onChange={(e) => setRating(e.target.value)}
        />
      </div>
      <div className="mb-3">
        <label>Review: </label>
        <textarea
          className="form-control"
          value={text}
          onChange={(e) => setText(e.target.value)}
        ></textarea>
      </div>

      <button type="submit" className="btn btn-primary mb-3">
        Submit Review
      </button>
    </form>
  );
};

export default ReviewForm;
