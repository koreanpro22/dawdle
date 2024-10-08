"use client";
import type { NextPage } from "next";
// import GroupEventCard from "../../components/GroupEventCard";
import EventDecisionButton from "../../components/EventDecisionButton";
import UpcomingDwadlesButton from "../../components/UpcomingDwadlesButton";
import { redirect, usePathname } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { doc, onSnapshot, getDoc } from "firebase/firestore";
import { firestore } from "@/lib/firebase/config";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState, useRef } from "react";
import { setCurEvent, selectCurEvent } from "@/lib/store/curEventSlice";
import { selectUser } from "@/lib/store/userSlice";
import CreateEventModal from "@/app/components/Modals/CreateEventModal";
import SingleEventModal from "@/app/components/Modals/SingleEventModal";
import EditEventModal from "@/app/components/Modals/EditEventModal";

interface Participant {
  id: string;
  email: string;
}

interface Event {
  id: string;
  title: string;
  address: string;
  date: string;
  time: string;
  type: string;
  itinerary: string;
  participants: Participant[];
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
  const dispatch = useDispatch();
  const [openInviteModal, setOpenInviteModal] = useState(false);
  const pathname = usePathname();
  const groupId = pathname.split("/").pop();
  const [group, setGroup] = useState<Group>({
    name: "",
    author: "",
    events: [],
    secret_key: "",
    members: [],
    imageUrl: "",
  });
  const [aniInvite, setAniInvite] = useState(false);

  const user = useSelector(selectUser);
  const curEvent = useSelector(selectCurEvent);

  const secretKeyRef = useRef(null);

  const hasLoadedRef = useRef(false);

  const copyToClipboard = () => {
    if (group.secret_key) {
      navigator.clipboard
        .writeText(group.secret_key)
        .then(() => {
          alert("Secret key copied to clipboard!");
          showInviteModal()
        })
        .catch((err) => {
          console.error("Failed to copy text: ", err);
        });
    }
  };

  const copyToClipboard1 = () => {
    if (group.secret_key) {
      navigator.clipboard
        .writeText(group.secret_key)
        .then(() => {
          alert("Secret key copied to clipboard!");
        })
        .catch((err) => {
          console.error("Failed to copy text: ", err);
        });
    }
  };



  // const handleJoinModal = () => {
  //   setAniJoin(!aniJoin);
  //   if (!aniJoin) {
  //     setJoinModal(!joinModal);
  //   } else
  //   setTimeout(() => {
  //     setJoinModal(!joinModal);
  //     setAdd(false);
  //   }, 500); 
  // };

  useEffect(() => {
    if (!groupId) return;

    const groupRef = doc(firestore, "groups", groupId as string);

    const unsubscribe = onSnapshot(
      groupRef,
      (snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.data();
          const groupData: Group = {
            name: data.name || "",
            author: data.author || "",
            events: data.events || [],
            secret_key: data.secret_key || "",
            members: data.members || [],
            imageUrl: data.imageUrl || "",
          };
          setGroup(groupData);
          if (!hasLoadedRef.current || groupData?.events?.length <= 1) {
            const parseDateTime = (event: Event) => {
              return new Date(`${event.date}T${event.time}`);
            };
  
            const sortedEvents = [...groupData.events].sort((a, b) => {
              return parseDateTime(a).getTime() - parseDateTime(b).getTime();
            });
  
            dispatch(setCurEvent(sortedEvents[0]));
            
  
            hasLoadedRef.current = true;
          }
        } else {
          redirect("/");
        }
      },
      (error) => {
        console.error("Error fetching group data: ", error);
        redirect("/");
      }
    );

    return () => unsubscribe();
  }, [groupId]);

  if (!user) redirect("/");

  const showInviteModal = () => {
    setAniInvite(!aniInvite);
    if (!aniInvite) {
      setOpenInviteModal(!openInviteModal);
    } else
      setTimeout(() => {
        setOpenInviteModal(!openInviteModal);
      }, 500); 
  };

  return (
    <>
      {openInviteModal && (
        <>
          <div
            onClick={showInviteModal}
            className={`${aniInvite ? "animate-fadeIn" : " animate-fadeOut"} bg-[#000]/50 h-[100dvh] absolute w-full z-[20]`}
          ></div>
          <div className={`${aniInvite ? "animate-slideDown" : "animate-slideUpOut"}  flex flex-col gap-[2vh] py-[4vh] justify-center items-center w-full absolute top-0 bg-[#360F50] z-[21]`}>
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
              <div className="flex justify-between flex-col" key={index}>
                {curEvent?.id == event?.id && (
                  <>
                    <SingleEventModal event={curEvent} />
                    <div className="flex justify-center items-center gap-[1vh] py-[2vh]">
                      {curEvent?.participants[0]?.id === user.id &&
                      curEvent?.participants.length !== 0 ? (
                        <EditEventModal event={event} eventIndex={index}/>
                      ) : curEvent?.participants.length >= 0 ? (
                        <EventDecisionButton
                          event={event}
                          eventIndex={index}
                        />
                      ) : null}
                    </div>
                  </>
                )}
              </div>
            );
          })}
          <div className="flex flex-col gap-[2vh] justify-center items-center">
            <CreateEventModal group={group} />

            {group?.members?.length > 1 ? (
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
                  onClick={copyToClipboard1}
                  className="text-[#8A58FF] text-[3vh] font-bold bg-white rounded-[1.5vh] px-[2vh] py-[1vh]"
                  ref={secretKeyRef}
                >
                  {group.secret_key}
                </button>
              </div>
            )}
          </div>
          <div className="mb-[3vh]">
            <UpcomingDwadlesButton events={group.events} />
            {/* <UpcomingDwadlesButton /> */}
          </div>
        </div>
      </div>
    </>
  );
};

export default Group;
