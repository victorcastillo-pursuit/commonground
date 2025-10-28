import { useState, useEffect } from "react";
import "./NatureSlideshow.css";

function NatureSlideshow() {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Array of nature image URLs (using Unsplash for now - you can replace with your own)
  const images = [
    "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&q=80", // Mountain lake
    "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1200&q=80", // Forest path
    "https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=1200&q=80", // Waterfall
    "https://images.unsplash.com/photo-1426604966848-d7adac402bff?w=1200&q=80", // Misty mountains
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 5000); // Change image every 5 seconds

    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <div className="nature-slideshow">
      {images.map((image, index) => (
        <div
          key={index}
          className={`slideshow-image ${
            index === currentIndex ? "active" : ""
          }`}
          style={{ backgroundImage: `url(${image})` }}
        />
      ))}
      <div className="slideshow-overlay"></div>
    </div>
  );
}

export default NatureSlideshow;
