import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import { doc, updateDoc, getDoc, onSnapshot } from "firebase/firestore";
import { firestore } from "@/lib/firebase/config";
import { usePathname } from "next/navigation";
import Image from "next/image";
import CircularProgress from "@mui/material/CircularProgress";
import { useDispatch } from "react-redux";
import { setCurEvent } from "@/lib/store/curEventSlice";

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
  const [aniOpen, setAniOpen] = React.useState(false);
  const dispatch = useDispatch();
  const [isButtonDisabled, setIsButtonDisabled] = React.useState(true);
  const [missingFields, setMissingFields] = React.useState<string[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [aniDucks, setAniDucks] = React.useState(false);

  React.useEffect(() => {
    const requiredFields = ["title", "address", "date", "time", "type"];
    const missing = requiredFields.filter(
      (field) => !formData[field as keyof FormData]
    );

    setMissingFields(missing);
    setIsButtonDisabled(missing.length > 0);
  }, [formData]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleGenerateItinerary = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
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

      let result = "";
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
      console.error("Error generating itinerary:", error);
    }
    setLoading(false);
  };

  //   const handleRemoveParticipant = (participantId: string) => {
  //     setFormData(prev => ({
  //       ...prev,
  //       participants: prev.participants.filter(participant => participant.id !== participantId),
  //     }));
  //   };

  const removeParticipant = async (
    participantId: string,
    eventIndex: number
  ) => {
    if (!groupId) return;
    try {
      const groupRef = doc(firestore, "groups", `${groupId}`);
      const groupSnap = await getDoc(groupRef);
      const currentEvents = groupSnap.data()?.events || [];

      const updatedEvent = currentEvents[eventIndex];
      if (!updatedEvent) return;

      updatedEvent.participants = updatedEvent.participants.filter(
        (participant: Participant) => participant.id !== participantId
      );

      await updateDoc(groupRef, {
        events: currentEvents,
      });
      alert(`Participant was removed successfully.`);
    } catch (error) {
      console.error("Error removing participant:", error);
    }
  };

  const handleOpen = () => {
    setAniOpen(!aniOpen);
    setOpen(true);
  };

  const handleClose = () => {
    setAniOpen(!aniOpen);
    setTimeout(() => {
      setOpen(false);
    }, 500);
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

  React.useEffect(() => {
    if (!groupId) return;

    const groupRef = doc(firestore, "groups", `${groupId}`);

    const unsubscribe = onSnapshot(groupRef, (docSnap) => {
      const updatedEvents = docSnap.data()?.events || [];
      const updatedEvent = updatedEvents[eventIndex];

      if (updatedEvent) {
        setFormData(updatedEvent);
        dispatch(setCurEvent(updatedEvent));
      }
    });

    return () => unsubscribe();
  }, [groupId, eventIndex]);

  const handleDelete = async () => {
    setAniDucks(true);
    setTimeout(() => {
      setAniDucks(false);
    }, 500);
    
    setTimeout(() => {
      const deleteEventFromGroup = async () => {
        const groupRef = doc(firestore, "groups", `${groupId}`);
        const groupSnap = await getDoc(groupRef);
  
        if (groupSnap.exists()) {
          const groupData = groupSnap.data();
  
          const events = groupData.events || [];
          console.log("events before deletion", events);
  
          const updatedEvents = events.filter(
            (_: any, index: number) => index !== eventIndex
          );
  
          console.log("events after deletion", updatedEvents);
  
          await updateDoc(groupRef, {
            events: updatedEvents,
          });
          const nextEventIndex =
            eventIndex < updatedEvents.length
              ? eventIndex
              : updatedEvents.length - 1;
  
          if (updatedEvents.length > 0) {
            const nextEvent = updatedEvents[nextEventIndex];
            dispatch(setCurEvent(nextEvent));
          } else {
            dispatch(setCurEvent(null));
          }
        } else {
          console.error("Group document not found");
        }
      };
  
      deleteEventFromGroup();
    }, 1000);
  };

  const getRandomDelay = () => `${Math.random() * 5}s`; // Delays between 0 to 5 seconds

  const ducks = [
    { id: 1, position: "top-0 left-0", size: "16vh", delay: getRandomDelay() },
    {
      id: 2,
      position: "top-0 left-[4vh]",
      size: "12vh",
      delay: getRandomDelay(),
    },
    {
      id: 3,
      position: "top-0 left-[8vh]",
      size: "8vh",
      delay: getRandomDelay(),
    },
    {
      id: 4,
      position: "top-0 left-[12vh]",
      size: "8vh",
      delay: getRandomDelay(),
    },
    { id: 5, position: "top-0 right-0", size: "12vh", delay: getRandomDelay() },
    {
      id: 6,
      position: "top-0 right-[4vh]",
      size: "12vh",
      delay: getRandomDelay(),
    },
    {
      id: 7,
      position: "top-0 right-[8vh]",
      size: "12vh",
      delay: getRandomDelay(),
    },
    {
      id: 8,
      position: "top-0 right-[12vh]",
      size: "12vh",
      delay: getRandomDelay(),
    },
    {
      id: 9,
      position: "top-0 right-[16vh]",
      size: "12vh",
      delay: getRandomDelay(),
    },
    {
      id: 10,
      position: "top-0 right-[20vh]",
      size: "12vh",
      delay: getRandomDelay(),
    },
    {
      id: 11,
      position: "top-0 right-[24vh]",
      size: "12vh",
      delay: getRandomDelay(),
    },
    {
      id: 12,
      position: "top-0 right-[28vh]",
      size: "12vh",
      delay: getRandomDelay(),
    },
  ];

  return (
    <div>
      <div>
          <div className="w-full flex justify-center items-center">
            <Image
              width={50}
              height={50}
              className={`${aniDucks ? "animate-scaleIn" : "animate-scaleOut"} inset-0 h-[20dvh] w-[20dvh] m-auto flex justify-center absolute z-[100]`}
              src={"/images/Duck.png"}
              alt=""
            />
          </div>

        {/* {aniDucks && (
          <>
            {ducks.map((duck) => (
              <Image
                key={duck.id}
                width={50}
                height={50}
                className={` animate-rain absolute ${duck.position} h-[${duck.size}]`}
                src={"/images/Duck.png"}
                alt=""
                style={{ animationDelay: duck.delay || "0s" }}
              />
            ))}
          </>
        )} */}
      </div>
      <button
        onClick={handleDelete}
        className="animate-fadeUpMin opacity-0 delay-200ms bg-primary-accent-color w-min rounded-[4vh] px-[2vh] py-[2vh] mr-[10px]"
      >
        <p className=" text-primary-text-color text-[3vh] font-bold text-nowrap">
          Delete Event
        </p>
      </button>
      <button
        onClick={handleOpen}
        className="animate-fadeUpMin opacity-0 delay-100ms bg-primary-text-color w-min rounded-[4vh] px-[2vh] py-[2vh]"
      >
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
        <div
          className={`${
            aniOpen ? "animate-slideDown" : "animate-slideUpOut"
          }  bg-[#FFCD80] h-[100dvh] flex justify-center items-center`}
        >
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
                  Event type
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

              <div className="flex flex-col gap-3">
                <label>Participants</label>
                <ul className="list-none p-0">
                  {formData.participants.slice(1).map((participant) => (
                    <li
                      key={participant.id}
                      className="flex items-center justify-between p-2 border-b"
                    >
                      <span>{participant.email}</span>
                      <Button
                        type="button"
                        variant="contained"
                        color="secondary"
                        onClick={() =>
                          removeParticipant(participant.id, eventIndex)
                        }
                      >
                        Remove
                      </Button>
                    </li>
                  ))}
                </ul>
              </div>
              {loading ? (
                <div className="flex justify-center">
                  <CircularProgress color="inherit" />
                </div>
              ) : (
                <button
                  type="button"
                  className={`lowercase rounded-[4vh] px-[2vh] py-[2vh] text-[3vh] font-bold mb-[2vh] w-[10vw] self-center transition-colors ease-in-out duration-300 ${
                    isButtonDisabled
                      ? "bg-gray-400 w-full rounded-[1vh] p-[1vh] transition-all ease-in-out"
                      : "group hover:bg-[#8A58FF] bg-white w-full rounded-[1vh] p-[1vh] transition-all ease-in-out"
                  }`}
                  onClick={handleGenerateItinerary}
                  disabled={isButtonDisabled}
                  title={
                    isButtonDisabled
                      ? `Missing fields: ${missingFields.join(", ")}`
                      : ""
                  }
                >
                  <h1 className="group-hover:text-[#fff]">Generate</h1>
                </button>
              )}

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
