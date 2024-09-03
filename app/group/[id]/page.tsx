"use client";
import type { NextPage } from "next";
import GroupEventCard from "../../components/GroupEventCard";
import EventDecisionButton from "../../components/EventDecisionButton";
import UpcomingDwadlesButton from "../../components/UpcomingDwadlesButton";
import { redirect, usePathname, useSearchParams } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { query, collection, getDocs, doc, getDoc } from "firebase/firestore";
import { firestore } from "@/lib/firebase/config";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { selectUser } from "@/lib/store/userSlice";
import CreateEventModal from "@/app/components/Modals/CreateEventModal";
import SingleEventModal from "@/app/components/Modals/SingleEventModal";

interface Event {
  address: string;
  participants: string[]; 
  title: string;
  type: string;
  name: string;
  date: string;
  time: string;
  groupImgSrc: string;
}

interface Group {
  name: string;
  author: string;
  events: Event[];
  secret_key: string;
  members: string[];
  imageUrl: string;
}

const Group: NextPage = () => {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const groupId = pathname.split("/").pop();
  // const [group, setGroup] = useState({});
  const [group, setGroup] = useState<Group>({
    name: "",
    author: "",
    events: [],
    secret_key: "",
    members: [],
    imageUrl: "",
  });

  const user = useSelector(selectUser);

  const getGroupByGroupId = async () => {
    const groupRef = doc(firestore, "groups", `${groupId}`);
    const groupSnap = await getDoc(groupRef);

    if (groupSnap.exists()) {
      const data = groupSnap.data();
      return data;
    } else {
      return redirect("/");
    }
  };

  useEffect(() => {
    const fetchGroup = async () => {
      const groupData = await getGroupByGroupId();
      console.log("group data: ", groupData)
      setGroup(groupData);
    };

    fetchGroup();
  }, [groupId]);

  if (!user) redirect("/");

  return (
    <div className="flex flex-col gap-5 w-[92%] mx-auto">
      <div className="flex w-full m-auto justify-center items-center">
        <Link href="/">
          <Image
            alt="eye"
            src={"/images/arrow-right-solid.svg"}
            width={0}
            height={0}
            className="w-[3.5vh] h-[3.5vh] rotate-180"
          />
        </Link>
        <div className="relative flex w-full justify-around  items-center text-center text-[3vh] p-[0.5vh] rounded-[1vh] my-[2vh]">
          <h1 className="text-primary-text-color">{group.name}</h1>
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
        {/* <EventDecisionButton event={event}/> */}
      </div>
      {group.events.map((event, index) => {
        console.log("e + i ===> ", event, index)
        return (
          <div className="flex justify-between">
            <SingleEventModal event={event} />
            <div>
              <EventDecisionButton event={event} eventIndex={index} />
            </div>
          </div>
        );
      })}
      <CreateEventModal />
    </div>
  );
};

export default Group;
