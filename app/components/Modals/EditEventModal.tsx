import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import { doc, updateDoc, getDoc } from "firebase/firestore";
import { firestore } from "@/lib/firebase/config";
import { usePathname } from "next/navigation";
import Image from "next/image";

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

interface EditEventModalProps {
  event: FormData;
  eventIndex: number;
}

const EditEventModal: React.FC<EditEventModalProps> = ({
  event,
  eventIndex,
}) => {
  const pathname = usePathname();
  const groupId = pathname.split("/").pop();
  const [open, setOpen] = React.useState(false);
  const [formData, setFormData] = React.useState<FormData>(event);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const groupRef = doc(firestore, "groups", `${groupId}`);
      const groupSnap = await getDoc(groupRef);
      const currentEvents = groupSnap.data()?.events || [];

      currentEvents[eventIndex] = formData;

      await updateDoc(groupRef, {
        events: currentEvents,
      });

      handleClose();
    } catch (error) {
      console.error("Error updating event:", error);
    }
  };

  return (
    <div>
      <button
        onClick={handleOpen}
        className="bg-primary-text-color w-min rounded-[4vh] px-[2vh] py-[2vh]"
      >
        {/* <div
                onClick={handleDelete}
                className={`bg-[#E9C0E9] rounded-full w-min p-[2vh] text-[6vh]`}
              >
                👎
              </div> */}
        <p className="text-primary-accent-color text-[3vh] font-bold text-nowrap">
          Edit Event
        </p>
      </button>

      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="edit-event-modal-title"
        aria-describedby="edit-event-modal-description"
      >
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

              <h1 className="text-[3vh] font-bold">edit event</h1>
            </div>
            <form
              className="flex flex-col gap-[2vh] w-[70%] m-auto"
              onSubmit={handleSubmit}
            >
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
                  value={formData.title}
                  onChange={handleChange}
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
                  value={formData.address}
                  onChange={handleChange}
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
                  name="date"
                  type="date"
                  value={formData.date}
                  onChange={handleChange}
                />
              </div>

              <div className="flex flex-col gap-3">
                <label
                  className="text-[2vh] text-[#000000] font-bold lowercase"
                  htmlFor="time"
                >
                  Event time
                </label>
                <input
                  className="text-start outline-none w-full transition-colors ease-in-out duration-300 hover:bg-[#9B7AFF] focus:bg-[#9B7AFF] placeholder:text-white text-white bg-[#8A58FF] rounded-fullw-full rounded-[1vh] p-[1.5vh]"
                  name="time"
                  type="time"
                  value={formData.time}
                  onChange={handleChange}
                />
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
                  value={formData.type}
                  onChange={handleChange}
                >
                  <option value="gym">Gym</option>
                  <option value="cafe">Cafe</option>
                  <option value="club">Club</option>
                  <option value="food">Restaurant</option>
                  <option value="park">Park</option>
                </select>
              </div>

              <div className="flex flex-col gap-3">
                <label
                  className="text-[2vh] text-[#000000] font-bold lowercase"
                  htmlFor="itinerary"
                >
                  Event Itinerary
                </label>
                <textarea
                  className="outline-none transition-colors ease-in-out duration-300 hover:bg-[#9B7AFF] focus:bg-[#9B7AFF] placeholder:text-white text-white bg-[#8A58FF] w-full rounded-[1vh] p-[1.5vh]"
                  name="itinerary"
                  rows={4}
                  value={formData.itinerary}
                  onChange={handleChange}
                ></textarea>
              </div>

              <button
                type="submit"
                className="group hover:bg-[#8A58FF] bg-white w-full rounded-[1vh] p-[1vh] transition-all ease-in-out"
              >
                <h1 className="text-[3.5vh] font-[900] group-hover:text-[#fff] text-[#8A58FF] transition-all ease-in-out">
                  Edit Event
                </h1>
              </button>
            </form>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default EditEventModal;
