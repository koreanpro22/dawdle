"use client";
import type { NextPage } from "next";
import GroupEventCard from "../../components/GroupEventCard";
import EventDecisionButton from "../../components/EventChoiceButton";
import UpcomingDwadlesButton from "../../components/UpcomingDwadlesButton";
import { usePathname, useSearchParams } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { query, collection, getDocs } from "firebase/firestore";
import { firestore } from "@/lib/firebase/config";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { selectUser } from "@/lib/store/userSlice";

const Group: NextPage = () => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  console.log("Pathname: ", pathname);
  const groupId = pathname.split("/").pop();
  console.log("groupId: ", groupId);
  const [groupEvents, setGroupEvents] = useState<any[]>([]);

  const user = useSelector(selectUser);

  const getAllGroupEvents = async () => {
    const eventsRef = query(collection(firestore, "events"));
    const events = await getDocs(eventsRef);

    const eventList: any = [];
    console.log("Event list Before: ", eventList);

    events.forEach((event: any) => {
      eventList.push(event.data());
    });

    console.log("Event list After: ", eventList);

    return eventList;
  };

  useEffect(() => {
    const fetchEvents = async () => {
      const events = await getAllGroupEvents();
      setGroupEvents(events);
    };

    fetchEvents();
  }, [groupId]);

  console.log(groupEvents)
  // console.log(GROUP_OBJ)
  return (
    <div className="flex flex-col gap-5 w-[92%] mx-auto">
      <div className="flex w-full m-auto justify-center items-center">
        <Link href="/dashboard">
          <Image
            alt="eye"
            src={"/images/arrow-right-solid.svg"}
            width={0}
            height={0}
            className="w-[3.5vh] h-[3.5vh] rotate-180"
          />
        </Link>
        <div className="relative flex w-full justify-around  items-center text-center text-[3vh] p-[0.5vh] rounded-[1vh] my-[2vh]">
          <h1 className="text-primary-text-color">{searchParams}</h1>
          <div className="flex gap-[1vh] justify-center items-center absolute right-0">
            <div className="bg-primary-text-color rounded-full flex justify-center items-center w-[4vh] h-[4vh[">
              <Image
                alt="new members"
                width={0}
                height={0}
                className="w-[4vh] h-[4vh["
                src={"/images/add-new.png"}
              ></Image>
            </div>
          </div>
        </div>
      </div>
      <div className="flex w-full justify-between">
        <EventDecisionButton />
      </div>
      <UpcomingDwadlesButton groups={groupEvents} />
      <Link
        href={{
          pathname: "events/create/[id]",
          query: {
            id: groupId,
          },
        }}
        as={`/events/create/${groupId}`}
      >
        <button className="font-[900] bg-primar">event +</button>
      </Link>
    </div>
  );
};

export default Group;
