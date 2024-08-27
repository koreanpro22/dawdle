"use client";

import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  selectCurrentGlobalEvent,
  setGlobalEvent
} from "../slices/globalEventSlice";

interface GroupProps {
  eventName: string;
  eventDate: string;
  eventTime: string;
  eventLocation: string;
  eventMembers: string[];
  groupImgSrc: string;
}

interface Group {
  groups: GroupProps[]; // Now expecting an array of groups
}

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function UpcomingDwadlesButton({ groups }: Group) {
  const [activeGroupIndex, setActiveGroupIndex] = useState<number | null>(null);
  const dispatch = useDispatch();

  const [active, setActive] = useState<boolean[]>(
    new Array(groups.length).fill(true)
  ); // Managing state for each group independently

  const handleEvent = (index: number) => {
    const newActive = [...active];
    newActive[index] = !newActive[index];
    setActive(newActive);
    setActiveGroupIndex(index);
    dispatch(setGlobalEvent(index))
  };

  return (
    <div className="flex flex-col justify-around items-center w-full gap-[1vh]">
      <h1 className="text-primary-accent-color text-start w-full text-[2.5vh] font-[900]">
        upcoming dwadles 🦆🐤
      </h1>{" "}
      {groups.map((group, index) => (
        <div
          key={index}
          onClick={() => handleEvent(index)}
          className={`${
              activeGroupIndex == index
              ? "bg-primary-accent-color text-white hidden"
              : "bg-[#D9D9D9] text-primary-accent-color"
          } pl-[2vh] flex gap-[2vh] items-center justify-between w-full rounded-full text-[1.75vh]`}
        >
          <span>{group.eventName}</span>
          <div>
            <span>{group.eventDate}</span>
            <span>{group.eventTime}</span>
          </div>
          <div
            className={`${
              activeGroupIndex == index
                ? "bg-[#D9D9D9] text-primary-accent-color"
                : "bg-primary-accent-color text-white"
            } font-[700] ml-auto w-fit rounded-full text-[2.0vh] p-[1.5vh] text-center`}
          >
            🦆 {group.eventMembers[0]}
          </div>
        </div>
      ))}
    </div>
  );
}
