"use client";

import { firestore } from "@/lib/firebase/config";
import { selectUser } from "@/lib/store/userSlice";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { usePathname } from "next/navigation";
import React, { useState } from "react";
import { useSelector } from "react-redux";
interface Participant {
  id: string;
  email: string;
}
interface EventProps {
  title: string;
  address: string;
  date: string;
  time: string;
  type: string;
  itinerary: string;
  participants: Participant[];
}

interface EventDecisionButtonProps {
  event: EventProps;
  eventIndex: number;
}

export default function EventDecisionButton({
  event,
  eventIndex,
}: EventDecisionButtonProps) {
  const [active, setActive] = useState(false);
  const [decision, setDecision] = useState(true);

  // console.log("event in decisions component", event)
  const pathname = usePathname();

  const user = useSelector(selectUser);
  const groupId = pathname.split("/").pop();

  const handleChoice = (decision: boolean) => {
    setDecision(decision);
    handleActive();
  };

  const handleActive = () => {
    setActive(!active);
  };

  const handleJoin = async () => {
    const addUserToEvent = async () => {
      const groupRef = doc(firestore, "groups", `${groupId}`);
      const groupSnap = await getDoc(groupRef);
  
      if (groupSnap.exists()) {
        const groupData = groupSnap.data();
  
        // Ensure the events array exists
        const events = groupData.events || [];
        console.log("events in join ", events);
  
        // Add the user to the specific event's participants array
        if (events[eventIndex]) {
          // Create the participant object
          const participant = {
            id: user.id,
            email: user.email,
          };
  
          // Check if the user is already a participant to avoid duplicates
          const isAlreadyParticipant = events[eventIndex].participants.some(
            (p: Participant) => p.id === user.id
          );
  
          if (!isAlreadyParticipant) {
            // Push the participant object
            events[eventIndex].participants.push(participant);
  
            // Update the document with the modified events array
            await updateDoc(groupRef, {
              events: events,
            });
  
            console.log("User added to event:", participant);
          } else {
            console.log("User is already a participant in the event");
          }
        } else {
          console.error("Event not found at the specified index");
          return;
        }
      } else {
        console.error("Group document not found");
      }
    };
  
    addUserToEvent();
  };


  const handleLeave = async () => {
    const removeUserFromEvent = async () => {
      const groupRef = doc(firestore, "groups", `${groupId}`);
      const groupSnap = await getDoc(groupRef);

      if (groupSnap.exists()) {
        const groupData = groupSnap.data();

        // Ensure the events array exists
        const events = groupData.events || [];
        console.log("events in leave ", events);

        // Remove the user from the specific event's participants array
        if (events[eventIndex]) {
          events[eventIndex].participants = events[eventIndex].participants.filter(
            (participant: Participant) => participant.id !== user.id
          );
        } else {
          console.error("Event not found at the specified index");
          return;
        }

        // Update the document with the modified events array
        await updateDoc(groupRef, {
          events: events,
        });
      } else {
        console.error("Group document not found");
      }
    };

    removeUserFromEvent();
  };

  const handleDelete = async () => {
    const deleteEventFromGroup = async () => {
      const groupRef = doc(firestore, "groups", `${groupId}`);
      const groupSnap = await getDoc(groupRef);

      if (groupSnap.exists()) {
        const groupData = groupSnap.data();

        // Ensure the events array exists
        const events = groupData.events || [];
        console.log("events before deletion", events);

        // Delete the specific event by filtering it out
        const updatedEvents = events.filter(
          (_: any, index: number) => index !== eventIndex
        );

        console.log("events after deletion", updatedEvents);

        // Update the document with the modified events array
        await updateDoc(groupRef, {
          events: updatedEvents,
        });
      } else {
        console.error("Group document not found");
      }
    };

    deleteEventFromGroup();
  };

  return (
    <>
      <div>
        {event?.participants[0]?.id == user.id ? (
          <div className="flex justify-around items-center w-full">
            <button
              onClick={handleDelete}
              className="bg-primary-accent-color w-min rounded-[4vh] px-[2vh] py-[2vh]"
            >
              {/* <div
                onClick={handleDelete}
                className={`bg-[#E9C0E9] rounded-full w-min p-[2vh] text-[6vh]`}
              >
                👎
              </div> */}
              <p className="text-primary-text-color text-[3vh] font-bold text-nowrap">
                Delete Event
              </p>
            </button>
          </div>
        ) : !event?.participants.some(participant => participant.id === user.id) ? (
          <div className="flex justify-around items-center w-full gap-[2vh]">
            <div
              onClick={handleJoin}
              className={`focus:bg-[#D2E823] hover:bg-[#D2E823] bg-[#ffffff] rounded-full w-min p-[2vh] text-[6vh] transition-all ease-in-out`}
            >
              👋
            </div>

            <div
              onClick={handleLeave}
              className={`focus:bg-[#E9C0E9] hover:bg-[#E9C0E9] bg-[#ffffff] rounded-full w-min p-[2vh] text-[6vh] transition-all ease-in-out`}
            >
              👎
            </div>
          </div>
        ) : (
          <div className="flex justify-around items-center w-full">
            <button className="bg-[#FFCD80] w-min rounded-[4vh] p-5">
              {!event?.participants.some(participant => participant.id === user.id) ? (
                <p onClick={handleLeave} className="text-[#360F50] text-[3vh] font-bold text-nowrap">
                  holding off
                </p>
              ) : (
                <p onClick={handleLeave} className="text-[#360F50] text-[3vh] font-bold text-nowrap">
                  you are joining
                </p>
              )}
            </button>
          </div>
        )}
      </div>
      {/* <div>
        {active ? (
          <>
            <button
              onClick={() => handleActive()}
              className="bg-secondary-accent-color w-full rounded-full p-[1vh]"
            >
              <h1 className="bg-[#] text-[3.5vh] font-[900] text-primary-accent-color">
                {decision ? "joining in" : "holding off"}
              </h1>
            </button>
          </>
        ) : (
          <div className="flex justify-around items-center w-full">
            <button className="bg-primary-accent-color w-min rounded-[4vh] p-5">
              <div
                onClick={handleJoin}
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
      </div> */}
    </>
  );
}
