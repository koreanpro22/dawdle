"use client";
import type { NextPage } from "next";
import { useRef } from "react";
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
  participants: string[]; // Assuming participants is an array of strings (user IDs, for example)
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
  const [openInviteModal, setOpenInviteModal] = useState(false);
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

  const secretKeyRef = useRef(null);

  const copyToClipboard = () => {
    const secretKey = secretKeyRef.current;
    if (secretKey) {
      navigator.clipboard
        .writeText(secretKey.textContent)
        .then(() => {
          alert("Secret key copied to clipboard!");
        })
        .catch((err) => {
          console.error("Failed to copy text: ", err);
        });
    }
  };

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

  const showInviteModal = () => {
    setOpenInviteModal(!openInviteModal);
  };

  useEffect(() => {
    const fetchGroup = async () => {
      const groupData = await getGroupByGroupId();
      console.log("group data: ", groupData);
      setGroup(groupData);
    };

    fetchGroup();
  }, [groupId]);

  if (!user) redirect("/");

  return (
    <>
      {openInviteModal && (
        <>
          <div onClick={showInviteModal} className="bg-[#000]/50 h-[100dvh] absolute w-full z-[20]"></div>
          <div className="flex flex-col gap-[2vh] py-[4vh] justify-center items-center w-full absolute top-0 bg-[#360F50] z-[21]">
            <h1 className="text-[3vh] text-white font-bold">invite people</h1>
            <div className="flex gap-[1vh]">
              <Image
                width={25}
                height={25}
                alt="dawdle"
                src={"/images/copy.png"}
              ></Image>
              <button
                onClick={copyToClipboard}
                className="text-[#8A58FF] text-[3vh] font-bold bg-white rounded-[1.5vh] px-[2vh] py-[1vh]"
                ref={secretKeyRef}
              >
                {group.secret_key}
              </button>
            </div>
          </div>
        </>
      )}

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
                  onClick={showInviteModal}
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

        <div className="w-full">
          {group.events.map((event, index) => {
            console.log("e + i ===> ", event, index);
            return (
              <div className="flex justify-between flex-col">
                <SingleEventModal event={event} />
                <div>
                  <EventDecisionButton event={event} eventIndex={index} />
                </div>
              </div>
            );
          })}
          <div className="flex flex-col gap-[1vh] justify-center items-center">
            <CreateEventModal group={group} />

            {group?.members?.length < 1 ? (
              <></>
            ) : (
              <div className="flex gap-[1vh]">
                <Image
                  width={25}
                  height={25}
                  alt="dawdle"
                  src={"/images/copy.png"}
                ></Image>
                <button
                  onClick={copyToClipboard}
                  className="text-[#8A58FF] text-[3vh] font-bold bg-white rounded-[1.5vh] px-[2vh] py-[1vh]"
                  ref={secretKeyRef}
                >
                  {group.secret_key}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Group;
