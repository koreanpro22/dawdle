import * as React from "react";
import Image from "next/image";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import { doc, getDoc, updateDoc, arrayUnion } from "firebase/firestore";
import { firestore } from "@/lib/firebase/config";
import { usePathname } from "next/navigation";
import { useSelector } from "react-redux";
import { selectUser } from "@/lib/store/userSlice";

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

interface Participant {
  id: string;
  email: string;
}

interface FormData {
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

interface Props {
  group: Group;
}

export default function CreateEventModal({ group }: Props) {
  const user = useSelector(selectUser);
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
      type: e.currentTarget.type.value,
      itinerary: e.currentTarget.itinerary.value,
      participants: [{ id: user.id, email: user.email }],
    };

    console.log("Form Data:", formData);

    const createEvent = async () => {
      alert("hitting create event");
      const groupRef = doc(firestore, "groups", `${groupId}`);
      const groupSnap = await getDoc(groupRef);
      console.log("groupRef: ", groupRef);
      console.log("groupSnap Data: ", groupSnap.data());

      await updateDoc(groupRef, {
        events: arrayUnion(formData),
      });
      handleClose();
    };

    createEvent();
  };
  console.log("Group Id", groupId);

  return (
    <div className="w-full">
      {group.events.length > 0 ? (
        <div className="w-full m-auto flex justify-center items-center">
          <button
            className="lowercase bg-white text-[#360F50] rounded-[4vh] px-[2vh] py-[2vh] text-[3vh] font-bold inset-0"
            onClick={handleOpen}
          >
            event +
          </button>
        </div>
      ) : (
        <div className="border-[0.25vh] border-white border-dashed w-full h-full flex justify-center items-center rounded-[2vh]">
          <button
            className="lowercase text-white text-[3vh] font-bold inset-0 h-[40dvh] "
            onClick={handleOpen}
          >
            + create event
          </button>
        </div>
      )}

      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        {/* <div className="w-[80%] mx-auto"> */}

        <div className="bg-[#FFCD80] h-[100dvh] flex justify-center items-center">
          <div className="flex p-[2vh] h-full flex-col w-full">
            <div className="flex relative justify-center">
              <div className="absolute top-0 left-0">
                <Image
                  onClick={handleClose}
                  alt="eye"
                  src={"/images/arrow-right-solid.svg"}
                  width={0}
                  height={0}
                  className="w-[3.5vh] h-[3.5vh] rotate-180"
                />
              </div>

              <h1 className="text-[3vh] font-bold">create event</h1>
            </div>

            <form
              className="flex flex-col gap-[2vh] w-[70%] m-auto"
              onSubmit={handleSubmit}
            >
              {/* <button
              type="submit"
              className="bg-secondary-accent-color w-full rounded-full p-[1vh]"
            > */}
              <div className="flex flex-col gap-3">
                <label
                  className="text-[2vh] text-[#000000] font-bold lowercase"
                  htmlFor="title"
                >
                  Event title
                </label>
                <input
                  className="outline-none transition-colors ease-in-out duration-300 hover:bg-[#9B7AFF] focus:bg-[#9B7AFF] placeholder:text-white text-white bg-[#8A58FF] w-full rounded-[1vh] p-[1.5vh]"
                  name="title"
                  type="text"
                />
              </div>

              <div className="flex flex-col gap-3">
                <label
                  className="text-[2vh] text-[#000000] font-bold lowercase"
                  htmlFor="address"
                >
                  Event address
                </label>
                <input
                  className="outline-none transition-colors ease-in-out duration-300 hover:bg-[#9B7AFF] focus:bg-[#9B7AFF] placeholder:text-white text-white bg-[#8A58FF] w-full rounded-[1vh] p-[1.5vh]"
                  name="address"
                  type="text"
                />
              </div>

              <div className="flex flex-col gap-3">
                <label
                  className="text-[2vh] text-[#000000] font-bold lowercase"
                  htmlFor="date"
                >
                  Event date
                </label>
                <input
                  className="outline-none transition-colors ease-in-out duration-300 hover:bg-[#9B7AFF] focus:bg-[#9B7AFF] placeholder:text-white text-white bg-[#8A58FF] w-full rounded-[1vh] p-[1.5vh]"
                  // onChange={handleDateChange}
                  name="date"
                  type="date"
                  // value={date}
                />
              </div>

              <div className="flex flex-col gap-3">
                <label
                  className="text-[2vh] text-[#000000] font-bold lowercase"
                  htmlFor="time"
                >
                  Event time
                </label>
                <div className="flex gap-1 w-full">
                  <input
                    className="text-start outline-none w-full transition-colors ease-in-out duration-300 hover:bg-[#9B7AFF] focus:bg-[#9B7AFF] placeholder:text-white text-white bg-[#8A58FF] rounded-fullw-full rounded-[1vh] p-[1.5vh]"
                    // onChange={handleTimeChange}
                    name="time"
                    // value={time}
                    type="time"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <label
                  className="text-[2vh] text-[#000000] font-bold lowercase"
                  htmlFor="type"
                >
                  Event time
                </label>
                <select
                  className="outline-none transition-colors ease-in-out duration-300 hover:bg-[#9B7AFF] focus:bg-[#9B7AFF] placeholder:text-white text-white bg-[#8A58FF] w-full rounded-[1vh] p-[1.5vh]"
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

              <div className="flex flex-col gap-3">
                <label htmlFor="itinerary">Event Itinerary</label>
                <textarea
                  className="outline-none transition-colors ease-in-out duration-300 hover:bg-[#9B7AFF] focus:bg-[#9B7AFF] placeholder:text-white text-white bg-[#8A58FF] w-full rounded-[1vh] p-[1.5vh]"
                  name="itinerary"
                  rows={4}
                ></textarea>
              </div>

              <button
                type="submit"
                className="bg-white w-full rounded-[1vh] p-[1vh]"
              >
                <h1 className="bg-[#] text-[3.5vh] font-[900] text-[#8A58FF]">
                  create event
                </h1>
              </button>
              {/* </button> */}
            </form>
          </div>
        </div>
      </Modal>
    </div>
  );
}
