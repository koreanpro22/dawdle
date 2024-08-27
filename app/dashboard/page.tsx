import Link from "next/link";
import GroupCard from "../components/GroupCard";
import { GROUP_OBJ } from "../lib/global.js";

export default function Dashboard() {

  return (
    <div className="flex flex-col gap-5 w-[80%] mx-auto">
      {/* Email of currently signed in user */}
      <p className="self-end py-5">Email@123.gmail.com</p>
      <button className="rounded-xl flex flex-col items-center justify-center py-7 bg-primary-accent-color text-primary-text-color relative">
        <div className="w-[70%]">
          <p className="text-5xl font-[900]">
            create
          </p>
          <input
              className="outline-none w-full py-2 px-4"
              type="text"
              placeholder="group name"
            />
        </div>
        <div className="text-6xl absolute bottom-3 right-3">🦆</div>
      </button>
      <button className="rounded-xl flex justify-center py-5 bg-secondary-accent-color text-primary-accent-color relative">
        <div className="flex flex-col gap-1 items-center w-[70%]">
          <p className="text-5xl font-[900]">join</p>
          <input
            className="outline-none w-full py-2 px-4"
            type="password"
            placeholder="group password"
          />
        </div>
        <div className="text-4xl absolute bottom-2 right-7">🐤</div>
      </button>
      {/* Loop through Group data  */}
      {GROUP_OBJ.map((group) => (
        <GroupCard key={group.id} group={group} />
      ))}
    </div>
  );
}
