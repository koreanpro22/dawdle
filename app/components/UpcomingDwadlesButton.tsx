// UpcomingDwadlesButton.js
"use client";

import { setCurEvent, selectCurEvent } from "@/lib/store/curEventSlice";
import React from "react";
import { useDispatch, useSelector } from "react-redux";

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

export default function UpcomingDwadlesButton({ events }: UpcomingDwadlesButtonProps) {
  const dispatch = useDispatch();
  const curEvent = useSelector(selectCurEvent);

  return (
    <div className="flex flex-col justify-around items-center w-full gap-[1vh] pt-[10vh]">
      <h1 className="text-primary-accent-color text-start w-full text-[2.5vh] font-[900]">
        Upcoming Dwadles 🦆🐤
      </h1>
      {events.filter(event => curEvent && event.title !== curEvent.title).map((event, index) => (
        <div 
        onClick={() => dispatch(setCurEvent(event))}
        key={index} className="bg-[#D9D9D9] text-primary-accent-color pl-[2vh] flex gap-[2vh] items-center justify-between w-full rounded-full text-[1.75vh]">
          <span>{event.title}</span>
          <div>
            <span>{event.date}</span>
            <br />
            <span>{event.time}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
