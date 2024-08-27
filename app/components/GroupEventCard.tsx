"use client";

import { useState } from "react";
import Image from "next/image";
import { GROUP_OBJ } from "../lib/global";

interface GroupProps {
  eventName: string;
  eventDate: string;
  eventTime: string;
  eventLocation: string;
  eventMembers: string[];
  groupImgSrc: string;
}

interface Group {
  group: GroupProps;
}
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function GroupEventCard({ group }: Group) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <div className="w-full relative">
      <h2 className="text-left text-primary-accent-color p-[0.5vh] text-[4vh] font-[900]">
        {`${group.eventDate} ${group.eventTime}`}
      </h2>
      <h2 className="text-left rounded-t-[0.5vh] bg-primary-accent-color text-primary-text-color py-[1vh] px-[2vh] text-[4vh] font-[900]">
        {group.eventName}
      </h2>
      <div className="h-[28vh]">
        <Image
          src={group.groupImgSrc}
          width={0}
          height={0}
          alt="Picture of the author"
          sizes="100vw"
          className="w-full h-full object-cover rounded-b-md"
        />
      </div>
      <div className="w-full flex items-center justify-between py-[2vh]">
        <h2 className="flex gap-[1vh] items-center text-left rounded-full bg-primary-accent-color w-fit text-primary-text-color text-[2.5vh] p-[2vh]">
          <div className="flex justify-center items-center m-auto w-[30px] h-[30px] bg-primary-text-color rounded-full">
            <span className="text-center m-auto">🦆</span>
          </div>
          {group.eventMembers[0]}
        </h2>

        <div className="flex gap-[1vh]">
          <h2 className="flex gap-[0.75vh] text-left rounded-full bg-primary-accent-color w-fit text-primary-text-color text-[2.5vh] p-[2vh]">
            {group.eventMembers.map((member, id) => (
              <div
                key={id}
                className="flex justify-center items-center m-auto w-[30px] h-[30px] bg-primary-text-color rounded-full"
              >
                <span className="text-center m-auto">🐤</span>
              </div>
            ))}
          </h2>

          <button onClick={openModal} className="bg-primary-text-color rounded-full p-[1vh]">
            <Image
              alt="eye"
              src={"/images/eye-solid.svg"}
              width={0}
              height={0}
              className="w-[4vh] h-[4vh]"
            ></Image>
          </button>
        </div>
      </div>
      <Modal isOpen={isModalOpen} onClose={closeModal} />
    </div>
  );
}

const Modal = ({ isOpen, onClose }: ModalProps) => {
  if (!isOpen) return null;

  return (
    <div
      className="text-primary-text-color fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-primary-accent-color p-6 rounded-lg shadow-lg max-w-sm w-full relative"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">Attendees -{GROUP_OBJ[0].eventMembers.length}</h2>
          <button
            className="text-3xl hover:text-gray-800"
            onClick={onClose}
          >
            &times;
          </button>
        </div>
        {GROUP_OBJ[0].eventMembers.map((member,idx) => (
          <div key={idx}>
            <div className="flex gap-2 mt-5 items-center">
              <div className="text-5xl p-2 rounded-full bg-white">
                🐤
              </div>
              <p className="text-2xl font-[900]">{member}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
