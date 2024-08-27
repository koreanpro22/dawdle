
"use client";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";


export default function EventCreate() {

  const [date, setDate] = useState<string>("")
  const [time, setTime] = useState<string>("")

  const handleDateChange = (e:React.ChangeEvent<HTMLInputElement>) => {
    setDate(e.target.value)
  }
  const handleTimeChange = (e:React.ChangeEvent<HTMLInputElement>) => {
    setTime(e.target.value)
  }
  
  const createFormattedDateTime = (): Date | null => {
    if (!date || !time) return null;

    // Construct the datetime string in ISO format
    const dateTimeString = `${date}T${time}`;

    return new Date(dateTimeString)
  }
  // Send data to API
  const handleSubmit = (e:React.FormEvent<HTMLFormElement>) => {
    e.preventDefault() 

    const formattedTime = createFormattedDateTime();
  }
  return (
    <>
      <div className="flex mx-auto justify-center items-center py-5">
        <Link className="basis-1/2 ml-2" href="/dashboard">
          <Image
            alt="eye"
            src={"/images/arrow-right-solid.svg"}
            width={0}
            height={0}
            className="w-[3.5vh] h-[3.5vh] rotate-180"
          />
        </Link>
        <div className="flex w-full justify-between items-center text-center text-[3vh] p-[0.5vh] rounded-[1vh]">
          <h1 className="text-primary-text-color">Create Event</h1>
        </div>
      </div>
      <div className="w-[80%] mx-auto">
        <form className="flex flex-col gap-5">
          <div className="flex flex-col gap-3">
            <label htmlFor="title">Event title</label>
            <input className="outline-none transition-colors ease-in-out duration-300 hover:bg-hover-color focus:bg-hover-color px-5 placeholder:text-black bg-secondary-accent-color w-full rounded-full p-[1vh]" name="title" type="text" />
          </div>

          <div className="flex flex-col gap-3">
            <label htmlFor="location">Event location</label>
            <input className="outline-none transition-colors ease-in-out duration-300 hover:bg-hover-color focus:bg-hover-color px-5 placeholder:text-black bg-secondary-accent-color w-full rounded-full p-[1vh]" name="location" type="text" />
          </div>

          <div className="flex flex-col gap-3">
            <label htmlFor="date">Event date</label>
            <input className="outline-none transition-colors ease-in-out duration-300 hover:bg-hover-color focus:bg-hover-color px-5 placeholder:text-black bg-secondary-accent-color w-full rounded-full p-[1vh]" onChange={handleDateChange} name="date" type="date" value={date}/>
          </div>

          <div className="flex flex-col gap-3">
            <p>Event time</p>
            <div className="flex gap-1">
              <input className="p-[1vh] text-center outline-none transition-colors ease-in-out duration-300 hover:bg-hover-color focus:bg-hover-color placeholder:text-black bg-secondary-accent-color rounded-full" onChange={handleTimeChange} name="time" value={time} type="time"/>
            </div>
          </div>
        
          <div className="flex flex-col gap-3">
            <label htmlFor="category">Event category</label>
            <select className=" transition-colors ease-in-out duration-300 hover:bg-hover-color focus:bg-hover-color px-5 placeholder:text-black bg-secondary-accent-color w-full rounded p-[1vh] outline-none" name="category" id="category">
              <option value="gym">Gym</option>
              <option value="cafe">Cafe</option>
              <option value="club">Club</option>
              <option value="food">Restaurant</option>
              <option value="park">Park</option>
            </select>
          </div>

          <button type="submit" className="bg-secondary-accent-color w-full rounded-full p-[1vh]">
            <h1 className="bg-[#] text-[3.5vh] font-[900] text-primary-accent-color">
              create event
            </h1>
          </button>
        </form>
      </div>
    </>
  )
}