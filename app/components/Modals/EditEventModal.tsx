import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import { doc, updateDoc, getDoc } from "firebase/firestore";
import { firestore } from "@/lib/firebase/config";
import { usePathname } from "next/navigation";

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

const EditEventModal: React.FC<EditEventModalProps> = ({ event, eventIndex }) => {
  const pathname = usePathname();
  const groupId = pathname.split("/").pop();
  const [open, setOpen] = React.useState(false);
  const [formData, setFormData] = React.useState<FormData>(event); 

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const groupRef = doc(firestore, 'groups', `${groupId}`);
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
      <Button variant="contained" onClick={handleOpen}>
        Edit Event
      </Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="edit-event-modal-title"
        aria-describedby="edit-event-modal-description"
      >
        <Box sx={style}>
          <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
            <div className="flex flex-col gap-3">
              <label htmlFor="title">Event title</label>
              <input
                className="outline-none px-5 w-full rounded-full p-[1vh]"
                name="title"
                type="text"
                value={formData.title}
                onChange={handleChange}
              />
            </div>

            <div className="flex flex-col gap-3">
              <label htmlFor="address">Event address</label>
              <input
                className="outline-none px-5 w-full rounded-full p-[1vh]"
                name="address"
                type="text"
                value={formData.address}
                onChange={handleChange}
              />
            </div>

            <div className="flex flex-col gap-3">
              <label htmlFor="date">Event date</label>
              <input
                className="outline-none px-5 w-full rounded-full p-[1vh]"
                name="date"
                type="date"
                value={formData.date}
                onChange={handleChange}
              />
            </div>

            <div className="flex flex-col gap-3">
              <p>Event time</p>
              <input
                className="p-[1vh] text-center outline-none px-5 rounded-full"
                name="time"
                type="time"
                value={formData.time}
                onChange={handleChange}
              />
            </div>

            <div className="flex flex-col gap-3">
              <label htmlFor="type">Event type</label>
              <select
                className="px-5 w-full rounded p-[1vh] outline-none"
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
              <label htmlFor="itinerary">Event Itinerary</label>
              <textarea
                className="outline-none px-5 w-full rounded p-[1vh]"
                name="itinerary"
                rows={4}
                value={formData.itinerary}
                onChange={handleChange}
              ></textarea>
            </div>
            
            <button
              type="submit"
              className="bg-secondary-accent-color w-full rounded-full p-[1vh]"
            >
              <h1 className="text-[3.5vh] font-[900] text-primary-accent-color">
                Edit Event
              </h1>
            </button>
          </form>
        </Box>
      </Modal>
    </div>
  );
};

export default EditEventModal;
