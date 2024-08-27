'use client'
import Image from "next/image";
import { useState } from "react";
import { getAllEmails, addEmail } from "./lib/actions";

// export default function Component() {
//   const { data: session } = useSession()
//   console.log(session)
//   if (session) {
//     return (
//       <>
//         Signed in as {session.user.email} <br />
//         <button onClick={() => signOut()}>Sign out</button>
//       </>
//     )
//   }



export default function Landing() {

  const [email, setEmail] = useState('');

    function isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  const handleEmailSubmit = async () => {
    if (!isValidEmail(email)) return alert('Not a valid Email')
    const res = await addEmail(email)
    setEmail('')
    if (res === 'Email already exists') return alert('Email already exists')
    alert(`Set up email for ${email}`)
  }

  const handleGetAllEmails = async () => {
    const emails = await getAllEmails()
    console.log(emails)
  }


  return (
    <div className="flex flex-col lg:flex-row w-[80%] m-auto lg:h-screen py-[1vh]">
      <div className="h-full lg:my-auto mx-auto flex flex-col lg:justify-center">
        <h1 className="animate-fadeIn text-[6vh] lg:text-[7vh] text-primary-text-color font-[900]">
          Connect, plan, and experience. All in one place.
        </h1>
        <div className="w-[95%]  text-primary-accent-color font-bold -ml-[2vh] lg:ml-0 my-5">
          <h2 className="lg:w-[100%] animate-fadeIn text-[10vh] lg:text-[20vh] tracking-[-0.1em] font-[900] lg:pl-5">
            10,000
          </h2>
          <p className="lg:w-[61%] animate-fadeIn text-right text-[3.25vh] lg:text-[4vh] font-[900] -mr-[2vh] lg:mr-0">users are Dawdling</p>
        </div>
        <div className="w-[80%] lg:my-0 lg:mx-0 mx-auto flex flex-col gap-3 my-5 pb-5">
          <p className="text-primary-text-color lg:self-start self-end underline underline-offset-2 ">
            Are you one of them?
          </p>
          <div className="flex lg:flex-row flex-col justify-start lg:gap-[2vh] gap-[1vh]">
            <input
              className="animate-fadeIn outline-none transition-all ease-in-out duration-300 hover:bg-hover-color focus:bg-hover-color px-5 placeholder:text-black rounded-full py-5 bg-secondary-accent-color"
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
            />
            <button
              className="animate-fadeIn self-end bg-primary-accent-color text-primary-text-color w-min py-3 px-5 rounded-full"
              // type="submit"
              onClick={() => handleEmailSubmit()}
            >
              submit
            </button>
          </div>
          {/* Email + Password Inputs */}
          {/* <div className="flex lg:flex-row flex-col justify-start lg:gap-[2vh] gap-[1vh]">
            <input
              className="animate-fadeIn outline-none transition-all ease-in-out duration-300 hover:bg-hover-color focus:bg-hover-color px-5 placeholder:text-black rounded-full py-5 bg-secondary-accent-color"
              type="text"
              placeholder="Email"
            />
            <input
              className="animate-fadeIn outline-none transition-all ease-in-out duration-300 hover:bg-hover-color focus:bg-hover-color px-5 placeholder:text-black rounded-full py-5 bg-secondary-accent-color"
              type="password"
              placeholder="Password"
            />
            <button
              className="animate-fadeIn self-end bg-primary-accent-color text-primary-text-color w-min py-3 px-5 rounded-full"
              type="submit"
            >
              submit
            </button>
          </div> */}
        </div>
      </div>

      <div className="animation-3d w-[80%] lg:my-auto mx-auto rotate-[-2deg]">
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
