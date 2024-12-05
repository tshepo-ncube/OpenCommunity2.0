import React, { useRef, useEffect } from 'react';

const ImageCarousel = ({ images }) => {
  const carouselRef = useRef(null);

  useEffect(() => {
    const interval = setInterval(() => {
      if (carouselRef.current) {
        carouselRef.current.scrollBy({
          left: 300, // Adjust the scrolling distance
          behavior: 'smooth', // Smooth scrolling effect
        });
        
        // If at the end, reset scroll to the beginning
        if (
          carouselRef.current.scrollLeft + carouselRef.current.offsetWidth >=
          carouselRef.current.scrollWidth
        ) {
          carouselRef.current.scrollTo({ left: 0, behavior: 'smooth' });
        }
      }
    }, 3000); // Auto-scroll every 3 seconds

    // Clear interval on component unmount
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full">
      <div
        ref={carouselRef}
        className="w-full overflow-x-auto flex space-x-4 p-4 scrollbar-hide"
      >
        {images.map((image, index) => (
          <div key={index} className="flex-none w-64 h-40 bg-gray-200 rounded-md shadow-md overflow-hidden">
            <img
              src={image}
              alt={`Carousel ${index}`}
              className="w-full h-full object-cover"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

// Sample usage
const App = () => {
  const images = [
    'https://images.unsplash.com/photo-1543832923-3ca345a4c92f?q=80&w=1470&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1533777857889-4be7c70b33f7?q=80&w=1470&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1542281286-9e0a16bb7366?q=80&w=1470&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1521747116042-5a810fda9664?q=80&w=1470&auto=format&fit=crop',
  ];

  return (
    <div className="max-w-5xl mx-auto mt-10">
      <h2 className="text-2xl font-bold mb-4">Auto-Scrolling Image Carousel</h2>
      <ImageCarousel images={images} />
    </div>
  );
};

export default App;
