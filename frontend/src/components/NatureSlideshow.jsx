import { useState, useEffect, useRef } from "react";
import { gsap } from "gsap";
import "./NatureSlideshow.css";

function NatureSlideshow() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const imageRefs = useRef([]);

  // Array of nature image URLs
  const images = [
    "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&q=80", // Mountain lake
    "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1200&q=80", // Forest path
    "https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=1200&q=80", // Waterfall
    "https://images.unsplash.com/photo-1426604966848-d7adac402bff?w=1200&q=80", // Misty mountains
  ];

  useEffect(() => {
    // Animate the current image in
    if (imageRefs.current[currentIndex]) {
      gsap.fromTo(
        imageRefs.current[currentIndex],
        {
          opacity: 0,
          scale: 1.1,
        },
        {
          opacity: 1,
          scale: 1,
          duration: 2,
          ease: "power2.out",
        }
      );

      // Subtle Ken Burns effect - slow zoom during display
      gsap.to(imageRefs.current[currentIndex], {
        scale: 1.05,
        duration: 5,
        ease: "none",
        delay: 2,
      });
    }

    // Fade out the previous image
    const prevIndex = currentIndex === 0 ? images.length - 1 : currentIndex - 1;
    if (imageRefs.current[prevIndex]) {
      gsap.to(imageRefs.current[prevIndex], {
        opacity: 0,
        duration: 1.5,
        ease: "power2.inOut",
      });
    }
  }, [currentIndex, images.length]);

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
          ref={(el) => (imageRefs.current[index] = el)}
          className="slideshow-image"
          style={{ backgroundImage: `url(${image})` }}
        />
      ))}
      <div className="slideshow-overlay"></div>
    </div>
  );
}

export default NatureSlideshow;
