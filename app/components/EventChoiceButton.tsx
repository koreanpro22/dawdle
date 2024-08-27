"use client";

import React, { useState } from "react";

// interface EventDecisionButtonProps {
//   choice: boolean;
// }

export default function EventDecisionButton() {
  const [active, setActive] = useState(false);
  const [decision, setDecision] = useState(true);

  const handleChoice = (decision: boolean) => {
    setDecision(decision);
    handleActive()
  };

  const handleActive = () => {
    setActive(!active);
  }

  return (
    <>
      {active ? (
        <>
          <button onClick={() => handleActive()} className="bg-secondary-accent-color w-full rounded-full p-[1vh]">
            <h1 className="bg-[#] text-[3.5vh] font-[900] text-primary-accent-color">
            {decision ? "joining in" : "holding off"}
            </h1>
          </button>
        </>
      ) : (
        <div className="flex justify-around items-center w-full">
          <button className="bg-primary-accent-color w-min rounded-[4vh] p-5">
            <div
              onClick={() => handleChoice(true)}
              className={`bg-[#D2E823] rounded-full w-min p-[2vh] text-[6vh]`}
            >
              👋
            </div>
            <p className="text-primary-text-color text-3xl font-[800] pt-5 text-nowrap">
              Join In
            </p>
          </button>
          <button className="bg-primary-accent-color w-min rounded-[4vh] p-5">
            <div
              onClick={() => handleChoice(false)}
              className={`bg-[#E9C0E9] rounded-full w-min p-[2vh] text-[6vh]`}
            >
              👎
            </div>
            <p className="text-primary-text-color text-3xl font-[800] pt-5 text-nowrap">
              Hold On
            </p>
          </button>
        </div>
      )}
    </>
  );
}
