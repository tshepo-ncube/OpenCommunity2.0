import React, { useState, useEffect } from "react";
import CommunityDB from "../database/community/community";
import Image from "next/image";
import { Carousel, Card } from "@/components/ui/apple-cards-carousel";

export default function RecommendedCommunities() {
  const [recommendedCommunities, setRecommendedCommunities] = useState([]);

  useEffect(() => {
    CommunityDB.RecommendedCommunities(setRecommendedCommunities);
  }, []);
  //   return (
  //     <>
  //       <h1>Hey there...</h1>

  //       <div class="w-full inline-flex flex-nowrap">
  //         <ul class="flex items-center justify-center md:justify-start [&_li]:mx-8 [&_img]:max-w-none animate-infinite-scroll">
  //           <li>
  //             <img src="./facebook.svg" alt="Facebook" />
  //           </li>
  //           <li>
  //             <img src="./disney.svg" alt="Disney" />
  //           </li>
  //           <li>
  //             <img src="./airbnb.svg" alt="Airbnb" />
  //           </li>
  //           <li>
  //             <img src="./apple.svg" alt="Apple" />
  //           </li>
  //           <li>
  //             <img src="./spark.svg" alt="Spark" />
  //           </li>
  //           <li>
  //             <img src="./samsung.svg" alt="Samsung" />
  //           </li>
  //           <li>
  //             <img src="./quora.svg" alt="Quora" />
  //           </li>
  //           <li>
  //             <img src="./sass.svg" alt="Sass" />
  //           </li>
  //         </ul>
  //         {/* <ul
  //           class="flex items-center justify-center md:justify-start [&_li]:mx-8 [&_img]:max-w-none animate-infinite-scroll"
  //           aria-hidden="true"
  //         >
  //           <li>
  //             <img src="./facebook.svg" alt="Facebook" />
  //           </li>
  //           <li>
  //             <img src="./disney.svg" alt="Disney" />
  //           </li>
  //           <li>
  //             <img src="./airbnb.svg" alt="Airbnb" />
  //           </li>
  //           <li>
  //             <img src="./apple.svg" alt="Apple" />
  //           </li>
  //           <li>
  //             <img src="./spark.svg" alt="Spark" />
  //           </li>
  //           <li>
  //             <img src="./samsung.svg" alt="Samsung" />
  //           </li>
  //           <li>
  //             <img src="./quora.svg" alt="Quora" />
  //           </li>
  //           <li>
  //             <img src="./sass.svg" alt="Sass" />
  //           </li>
  //         </ul> */}
  //       </div>

  //     </>
  //   );

  const cards = data.map((card, index) => (
    <Card key={card.src} card={card} index={index} />
  ));

  return (
    <div className="w-full h-full py-20">
      <h2 className="max-w-7xl pl-4 mx-auto text-xl md:text-5xl font-bold text-neutral-800 dark:text-neutral-200 font-sans">
        Get to know your iSad.
      </h2>
      <Carousel items={cards} />
    </div>
  );
}

const DummyContent = () => {
  return (
    <>
      {[...new Array(3).fill(1)].map((_, index) => {
        return (
          <div
            key={"dummy-content" + index}
            className="bg-[#F5F5F7] dark:bg-neutral-800 p-8 md:p-14 rounded-3xl mb-4"
          >
            <p className="text-neutral-600 dark:text-neutral-400 text-base md:text-2xl font-sans max-w-3xl mx-auto">
              <span className="font-bold text-neutral-700 dark:text-neutral-200">
                The first rule of Apple club is that you boast about Apple club.
              </span>{" "}
              Keep a journal, quickly jot down a grocery list, and take amazing
              class notes. Want to convert those notes to text? No problem.
              Langotiya jeetu ka mara hua yaar is ready to capture every
              thought.
            </p>
            <Image
              src="https://assets.aceternity.com/macbook.png"
              alt="Macbook mockup from Aceternity UI"
              height="500"
              width="500"
              className="md:w-1/2 md:h-1/2 h-full w-full mx-auto object-contain"
            />
          </div>
        );
      })}
    </>
  );
};

const data = [
  {
    category: "Artificial Intelligence",
    title: "You can do more with AI.",
    src: "https://images.unsplash.com/photo-1593508512255-86ab42a8e620?q=80&w=3556&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    content: <DummyContent />,
  },
  {
    category: "Productivity",
    title: "Enhance your productivity.",
    src: "https://images.unsplash.com/photo-1531554694128-c4c6665f59c2?q=80&w=3387&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    content: <DummyContent />,
  },
  {
    category: "Product",
    title: "Launching the new Apple Vision Pro.",
    src: "https://images.unsplash.com/photo-1713869791518-a770879e60dc?q=80&w=2333&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    content: <DummyContent />,
  },

  {
    category: "Product",
    title: "Maps for your iPhone 15 Pro Max.",
    src: "https://images.unsplash.com/photo-1599202860130-f600f4948364?q=80&w=2515&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    content: <DummyContent />,
  },
  {
    category: "iOS",
    title: "Photography just got better.",
    src: "https://images.unsplash.com/photo-1602081957921-9137a5d6eaee?q=80&w=2793&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    content: <DummyContent />,
  },
  {
    category: "Hiring",
    title: "Hiring for a Staff Software Engineer",
    src: "https://images.unsplash.com/photo-1511984804822-e16ba72f5848?q=80&w=2048&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    content: <DummyContent />,
  },
];
