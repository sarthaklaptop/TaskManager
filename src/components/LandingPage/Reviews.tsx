'use client'

import { cn } from "@/lib/utils";
import Marquee from "@/components/magicui/marquee";

const reviews = [
  {
    name: "Sarthak",
    username: "@sarthak",
    body: "Timetaskr has completely transformed how I manage my day. Tasks are no longer overwhelming!",
    img: "https://avatar.iran.liara.run/public/15",
  },
  {
    name: "Ishan",
    username: "@ishan",
    body: "This app is a game-changer! Managing both tasks and time efficiently has never been easier.",
    img: "https://avatar.iran.liara.run/public/40",
  },
  {
    name: "Ritesh",
    username: "@ritesh",
    body: "Timetaskr helped me stay on top of deadlines like never before. Highly recommended for anyone juggling multiple projects!",
    img: "https://avatar.iran.liara.run/public/9",
  },
  {
    name: "Aakash",
    username: "@akash",
    body: "Finally found an app that keeps my tasks and time in check. The user experience is seamless!",
    img: "https://avatar.iran.liara.run/public/18",
  },
  {
    name: "Sanchit",
    username: "@sanchit",
    body: "With Timetaskr, I’ve become so much more productive. It’s like having a personal assistant!",
    img: "https://avatar.iran.liara.run/public/38",
  },
  {
    name: "Pitamber",
    username: "@pitamber",
    body: "The best tool I've used for task and time management. It keeps me organized and ahead of schedule.",
    img: "https://avatar.iran.liara.run/public/21",
  },
];


const firstRow = reviews.slice(0, reviews.length / 2);
const secondRow = reviews.slice(reviews.length / 2);

const ReviewCard = ({
  img,
  name,
  username,
  body,
}: {
  img: string;
  name: string;
  username: string;
  body: string;
}) => {
  return (
    <figure
      className={cn(
        "relative w-64 cursor-pointer overflow-hidden rounded-xl border p-4",
        // light styles
        "border-gray-950/[.1] bg-gray-950/[.01] hover:bg-gray-950/[.05]",
        // dark styles
        "dark:border-gray-50/[.1] dark:bg-gray-50/[.10] dark:hover:bg-gray-50/[.15]",
      )}
    >
      <div className="flex flex-row items-center gap-2">
        <img className="rounded-full" width="32" height="32" alt="" src={img} />
        <div className="flex flex-col">
          <figcaption className="text-sm font-medium dark:text-white">
            {name}
          </figcaption>
          <p className="text-xs font-medium dark:text-white/40">{username}</p>
        </div>
      </div>
      <blockquote className="mt-2 text-sm">{body}</blockquote>
    </figure>
  );
};

export default function Reviews() {
  return (
    <div className="relative flex h-[500px] w-full flex-col items-center justify-center overflow-hidden rounded-lg border bg-background md:shadow-xl">
      <Marquee pauseOnHover className="[--duration:20s]">
        {firstRow.map((review) => (
          <ReviewCard key={review.username} {...review} />
        ))}
      </Marquee>
      <Marquee reverse pauseOnHover className="[--duration:20s]">
        {secondRow.map((review) => (
          <ReviewCard key={review.username} {...review} />
        ))}
      </Marquee>
      <div className="pointer-events-none absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-white dark:from-background"></div>
      <div className="pointer-events-none absolute inset-y-0 right-0 w-1/3 bg-gradient-to-l from-white dark:from-background"></div>
    </div>
  );
}
