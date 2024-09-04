// UpcomingDwadlesButton.js
"use client";

import { setCurEvent, selectCurEvent } from "@/lib/store/curEventSlice";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import Image from "next/image";

interface Participant {
  id: string;
  email: string;
}

interface Event {
  title: string;
  address: string;
  date: string;
  time: string;
  type: string;
  itinerary: string;
  participants: Participant[];
}

interface UpcomingDwadlesButtonProps {
  events: Event[]; // Corrected to handle an array of Event objects
}

export default function UpcomingDwadlesButton({
  events,
}: UpcomingDwadlesButtonProps) {
  const dispatch = useDispatch();
  const curEvent = useSelector(selectCurEvent);

  // Function to parse date and time into a single Date object
  const parseDateTime = (event: Event) => {
    return new Date(`${event.date}T${event.time}`);
  };

  // Sorting events by datetime
  const sortedEvents = events.sort((a, b) => {
    return parseDateTime(a).getTime() - parseDateTime(b).getTime();
  });

  return (
    <div className="flex flex-col justify-around items-center w-full gap-[1vh] pt-[10vh]">
      <h1 className="text-primary-accent-color text-start w-full text-[2.5vh] font-[900]">
        Upcoming Dawdles 🦆🐤
      </h1>
      {sortedEvents
        .filter((event) => curEvent && event.title !== curEvent.title)
        .map((event, index) => (
          <div
            onClick={() => dispatch(setCurEvent(event))}
            key={index}
            className="h-[4rem] relative bg-[#fff] text-primary-accent-color pl-[2vh] flex gap-[2vh] items-center justify-between w-full rounded-full text-[1.75vh]"
          >
            <span className="text-[2vh] font-bold">{event.title}</span>
            <div className="flex">
              <div className="absolute top-0 right-0 rounded-[3vh] flex h-full justify-center items-center">

              <span className="text-[2vh] font-bold">
                {`${new Date(event.date).toLocaleDateString("en-US", {
                  month: "numeric",
                  day: "numeric",
                })} ${new Date(
                  `1970-01-01T${event.time}Z`
                ).toLocaleTimeString("en-US", {
                  hour: "numeric",
                  minute: "numeric",
                  hour12: true,
                })}`}
              </span>
              <div className="bg-[#360F50] rounded-[2.5vh] flex text-white justify-center items-center text-[1.75vh] gap-[1vh] px-[1vh] h-full">
                <Image
                  width={25}
                  height={25}
                  alt="duck"
                  src={"/images/Duck.png"}
                  className="bg-white rounded-full"
                ></Image>
                {event?.participants[0]?.email?.split("@")[0]}
              </div>
              </div>

            </div>
          </div>
        ))}
    </div>
  );
}
