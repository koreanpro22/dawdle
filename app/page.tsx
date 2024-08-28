"use client";
import Image from "next/image";
import { useEffect, useState, useRef } from "react";
import { getAllEmails, addEmail } from "./lib/actions";

export default function Landing() {
  const [allEmails, setAllEmails] = useState(0);
  const [email, setEmail] = useState("");

  const audioRef = useRef<HTMLAudioElement>(null);

  const playSound = () => {
    if (audioRef.current) {
      audioRef.current.play();
    }
  };

  const handleEmailSubmit = async () => {
    playSound();
    if (!email) return;
    const res = await addEmail(email);
    setEmail("");
    setAllEmails(allEmails + 1);
    if (res === "Email already exists") return alert("Email already exists");
  };

  const handleGetAllEmails = async () => {
    const emails = await getAllEmails();
    setAllEmails(emails.length);
  };

  useEffect(() => {
    handleGetAllEmails();
  }, []);

  return (
    <div className="lg:w-[90%] flex flex-col lg:flex-row m-auto lg:h-screen p-[3vh] max-h-[100dvh] h-[100dvh] overflow-hidden">
      <div className="lg:my-auto mx-auto flex flex-col lg:justify-center">
        <audio
          ref={audioRef}
          src="/quack.mp3"
          preload="auto"
        ></audio>

        <h1 className="animate-fadeIn lg:m-auto text-[6.5vh] lg:text-[7vh] text-primary-text-color font-[800]">
          Connect,
          <br />
          plan, and experience.
          <br />
          All in one
          <br />
          place.
        </h1>
        <div className="text-primary-accent-color font-bold text-center lg:ml-0 lg:w-[90%]">
          <h2 className="lg:animate-rotate animate-flip lg:w-[100%] Lg:text-right text-[#FFCD80] text-[18vh] lg:text-[20vh] tracking-[-0.1em] font-[900] lg:pl-5">
            {allEmails}
          </h2>
          <p className="leading-[4rem] -mt-[6vh] lg:mt-0 lg:text-right animate-fadeIn lg:text-[3vh] text-[8vh] font-[800] lg:mr-0">
            <span className="text-white">ducks </span>
            are Dawdling
          </p>
        </div>
        <div className="z-10 w-[80%] lg:my-0 lg:mx-0 mx-auto flex flex-col gap-3 my-5 pb-5">
          <p className="text-primary-text-color lg:self-start self-center underline underline-offset-2 ">
            Are you one of them?
          </p>
          <div className="flex lg:flex-row lg:w-full justify-center lg:gap-[2vh] gap-[1vh] relative">
            <input
              className="placeholder:text-[#8A58FF] text-[#360F50] flex-1 animate-fadeIn outline-none transition-all ease-in-out duration-300 hover:bg-hover-color focus:bg-hover-color px-5 rounded-full py-5 bg-secondary-accent-color"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="email"
            />
            <button
              className="absolute right-0 animate-fadeIn align-center m-auto h-full"
              onClick={() => handleEmailSubmit()}
            >
              <img className="w-[6vh] h-[6vh]" src="/images/Duck.png" alt="" />
            </button>
          </div>
        </div>
      </div>

      <div className="animate-swim lg:animate-none lg:flex animation-3d lg:w-[40%] w-[90%] m-auto lg:my-auto mx-auto rotate-[-2deg]">
        <h2 className="text-center font-[900] text-2xl text-primary-accent-color my-2">
          27th Saturday 5:00PM
        </h2>
        <div className="w-[90%] mx-auto relative ">
          <div className="absolute bg-primary-accent-color py-2 px-3 rounded-full top-0 left-0 -translate-x-5 -translate-y-2">
            <div className="flex gap-1">
              <div className="rounded-full bg-white p-1">🦆</div>
              <div className="rounded-full bg-white p-1">🐤</div>
              <div className="rounded-full bg-white p-1">🐤</div>
              <div className="rounded-full bg-white p-1">🐤</div>
              <div className="rounded-full bg-white p-1">🐤</div>
            </div>
          </div>
          <div className="">
            <Image
              src="/images/landing-page.png"
              width={0}
              height={0}
              alt="Picture of the author"
              sizes="100vw"
              className=" w-full h-auto rounded-xl"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
