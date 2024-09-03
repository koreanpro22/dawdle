import * as React from "react";
import Image from "next/image";
import Modal from "@mui/material/Modal";
import { doc, getDoc, updateDoc, arrayUnion } from "firebase/firestore";
import { firestore } from "@/lib/firebase/config";
import { usePathname } from "next/navigation";
import { useSelector } from "react-redux";
import { selectUser } from "@/lib/store/userSlice";

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
  const [formData, setFormData] = React.useState<FormData>({
    title: "",
    address: "",
    date: "",
    time: "",
    type: "",
    itinerary: "",
    participants: [{ id: user.id, email: user.email }],
  });

  const [isButtonDisabled, setIsButtonDisabled] = React.useState(true);
  const [missingFields, setMissingFields] = React.useState<string[]>([]);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Check if all required fields except itinerary are filled
  React.useEffect(() => {
    const requiredFields = ["title", "address", "date", "time", "type"];
    const missing = requiredFields.filter((field) => !formData[field as keyof FormData]);

    setMissingFields(missing);
    setIsButtonDisabled(missing.length > 0);
  }, [formData]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const createEvent = async () => {
      const groupRef = doc(firestore, "groups", `${groupId}`);
      await updateDoc(groupRef, {
        events: arrayUnion(formData),
      });

      setFormData({
        title: "",
        address: "",
        date: "",
        time: "",
        type: "",
        itinerary: "",
        participants: [{ id: user.id, email: user.email }],
      });
      handleClose();
    };

    createEvent();
  };

  const handleGenerateItinerary = async () => {
    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          address: formData.address,
          date: formData.date,
          time: formData.time,
          type: formData.type,
        }),
      });

      const reader = response.body?.getReader();
      if (!reader) return;

      let result = '';
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        result += decoder.decode(value);
      }

      setFormData((prevData) => ({
        ...prevData,
        itinerary: result,
      }));
    } catch (error) {
      console.error('Error generating itinerary:', error);
    }
  };


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
            className="lowercase text-white text-[3vh] font-bold inset-0 h-[40dvh]"
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

            <form className="flex flex-col gap-[2vh] w-[70%] m-auto" onSubmit={handleSubmit}>
              <div className="flex flex-col gap-3">
                <label className="text-[2vh] text-[#000000] font-bold lowercase" htmlFor="title">
                  Event title
                </label>
                <input
                  className="outline-none transition-colors ease-in-out duration-300 hover:bg-[#9B7AFF] focus:bg-[#9B7AFF] placeholder:text-white text-white bg-[#8A58FF] w-full rounded-[1vh] p-[1.5vh]"
                  name="title"
                  type="text"
                  value={formData.title}
                  onChange={handleInputChange}
                />
              </div>

              <div className="flex flex-col gap-3">
                <label className="text-[2vh] text-[#000000] font-bold lowercase" htmlFor="address">
                  Event address
                </label>
                <input
                  className="outline-none transition-colors ease-in-out duration-300 hover:bg-[#9B7AFF] focus:bg-[#9B7AFF] placeholder:text-white text-white bg-[#8A58FF] w-full rounded-[1vh] p-[1.5vh]"
                  name="address"
                  type="text"
                  value={formData.address}
                  onChange={handleInputChange}
                />
              </div>

              <div className="flex flex-col gap-3">
                <label className="text-[2vh] text-[#000000] font-bold lowercase" htmlFor="date">
                  Event date
                </label>
                <input
                  className="outline-none transition-colors ease-in-out duration-300 hover:bg-[#9B7AFF] focus:bg-[#9B7AFF] placeholder:text-white text-white bg-[#8A58FF] w-full rounded-[1vh] p-[1.5vh]"
                  name="date"
                  type="date"
                  value={formData.date}
                  onChange={handleInputChange}
                />
              </div>

              <div className="flex flex-col gap-3">
                <label className="text-[2vh] text-[#000000] font-bold lowercase" htmlFor="time">
                  Event time
                </label>
                <input
                  className="text-start outline-none w-full transition-colors ease-in-out duration-300 hover:bg-[#9B7AFF] focus:bg-[#9B7AFF] placeholder:text-white text-white bg-[#8A58FF] w-full rounded-[1vh] p-[1.5vh]"
                  name="time"
                  type="time"
                  value={formData.time}
                  onChange={handleInputChange}
                />
              </div>

              <div className="flex flex-col gap-3">
                <label className="text-[2vh] text-[#000000] font-bold lowercase" htmlFor="type">
                  Event type
                </label>
                <select
                  className="outline-none transition-colors ease-in-out duration-300 hover:bg-[#9B7AFF] focus:bg-[#9B7AFF] placeholder:text-white text-white bg-[#8A58FF] w-full rounded-[1vh] p-[1.5vh]"
                  name="type"
                  value={formData.type}
                  onChange={handleInputChange}
                >
                  <option value="">Select Type</option>
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
                  value={formData.itinerary}
                  onChange={handleInputChange}
                ></textarea>
              </div>

              <button
                type="button"
                  className={`lowercase rounded-[4vh] px-[2vh] py-[2vh] text-[3vh] font-bold mb-[2vh] w-[10vw] self-center transition-colors ease-in-out duration-300 ${
                    isButtonDisabled
                      ? "bg-gray-400"
                      : "bg-[#9B7AFF] hover:bg-[#7a4cc0]"
                  }`}
                onClick={handleGenerateItinerary}
                disabled={isButtonDisabled}
                title={isButtonDisabled ? `Missing fields: ${missingFields.join(', ')}` : ""}
              >
                Generate
              </button>
              <button
              type="submit"
              className="bg-white w-full rounded-[1vh] p-[1vh]"
              >
              <h1 className="bg-[#] text-[3.5vh] font-[900] text-[#8A58FF]">
                create event
              </h1>
              </button>
            </form>
          </div>
        </div>
      </Modal>
    </div>
  );
}


