import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import { doc, getDoc, addDoc, setDoc, collection, updateDoc, arrayUnion } from "firebase/firestore";
import { firestore } from "@/lib/firebase/config";
import { redirect, usePathname } from "next/navigation";

const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

interface FormData {
  title: string;
  address: string;
  date: string;
  time: string;
  type: string;
}

export default function CreateEventModal() {
  const pathname = usePathname();
  const groupId = pathname.split("/").pop();
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData: FormData = {
      title: e.currentTarget.title.value,
      address: e.currentTarget.address.value,
      date: e.currentTarget.date.value,
      time: e.currentTarget.time.value,
      type: e.currentTarget.type.value
    };

    console.log("Form Data:", formData);
    const createEvent = async () => {
      alert("hitting create event");
      const groupRef = doc(firestore, 'groups', `${groupId}`)
      const groupSnap = await getDoc(groupRef)
      console.log('groupRef: ', groupRef)
      console.log('groupSnap Data: ', groupSnap.data())
    //   setDoc(groupRef, { events: [..., formData]})
        await updateDoc(groupRef, {
            events: arrayUnion(formData),
        })
    };

    createEvent();
  };
    console.log("Group Id", groupId);

  return (
    <div>
      <Button variant="contained" onClick={handleOpen}>
        Create Event +
      </Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        {/* <div className="w-[80%] mx-auto"> */}
        <Box sx={style}>
          <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
            <div className="flex flex-col gap-3">
              <label htmlFor="title">Event title</label>
              <input
                className="outline-none transition-colors ease-in-out duration-300 hover:bg-hover-color focus:bg-hover-color px-5 placeholder:text-black bg-secondary-accent-color w-full rounded-full p-[1vh]"
                name="title"
                type="text"
              />
            </div>

            <div className="flex flex-col gap-3">
              <label htmlFor="address">Event address</label>
              <input
                className="outline-none transition-colors ease-in-out duration-300 hover:bg-hover-color focus:bg-hover-color px-5 placeholder:text-black bg-secondary-accent-color w-full rounded-full p-[1vh]"
                name="address"
                type="text"
              />
            </div>

            <div className="flex flex-col gap-3">
              <label htmlFor="date">Event date</label>
              <input
                className="outline-none transition-colors ease-in-out duration-300 hover:bg-hover-color focus:bg-hover-color px-5 placeholder:text-black bg-secondary-accent-color w-full rounded-full p-[1vh]"
                // onChange={handleDateChange}
                name="date"
                type="date"
                // value={date}
              />
            </div>

            <div className="flex flex-col gap-3">
              <p>Event time</p>
              <div className="flex gap-1">
                <input
                  className="p-[1vh] text-center outline-none transition-colors ease-in-out duration-300 hover:bg-hover-color focus:bg-hover-color placeholder:text-black bg-secondary-accent-color rounded-full"
                  // onChange={handleTimeChange}
                  name="time"
                  // value={time}
                  type="time"
                />
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <label htmlFor="type">Event type</label>
              <select
                className=" transition-colors ease-in-out duration-300 hover:bg-hover-color focus:bg-hover-color px-5 placeholder:text-black bg-secondary-accent-color w-full rounded p-[1vh] outline-none"
                name="type"
                id="type"
              >
                <option value="gym">Gym</option>
                <option value="cafe">Cafe</option>
                <option value="club">Club</option>
                <option value="food">Restaurant</option>
                <option value="park">Park</option>
              </select>
            </div>

            <button
              type="submit"
              className="bg-secondary-accent-color w-full rounded-full p-[1vh]"
            >
              <h1 className="bg-[#] text-[3.5vh] font-[900] text-primary-accent-color">
                create event
              </h1>
            </button>
          </form>
        </Box>
      </Modal>
    </div>
  );
}
