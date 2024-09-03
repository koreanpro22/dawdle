import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
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
interface Event {
  title: string;
  address: string;
  date: string;
  time: string;
  type: string;
  participants: string[];
  groupImgSrc: string;
}

interface SingleEventModalProps {
  event: Event;
}

export default function SingleEventModal({ event }: SingleEventModalProps) {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <div>
      {/* <Button onClick={handleOpen}>{event.title}</Button> */}
      <button className=" relative w-full">
        <Image
          className="w-full"
          width={250}
          height={250}
          alt={"dawdle"}
          src={"/images/placeholder-location.png"}
        ></Image>
        <div
          className="top-0 absolute z-[10] bg-[#360F50] rounded-t-[1vh] w-full flex justify-center items-center gap-[1vh] py-[2vh]"
          onClick={handleOpen}
        >
          <p className="text-white font-semibold text-[3vh]">{event.title}</p>
        </div>

        <div className="flex justify-between absolute w-full bottom-[1dvh]">
          <button className="text-white bg-[#360F50] px-[2vh] py-[1vh] gap-[1vh] rounded-full font-semibold text-[4vh] flex justify-center items-center">
            <Image
              width={50}
              height={50}
              alt="chick"
              src={"/images/Duck.png"}
              className="bg-white rounded-full"
            ></Image>
            {event.participants.length}
          </button>

          <button className="text-white bg-[#360F50] px-[2vh] py-[1vh] gap-[1vh] rounded-full font-semibold text-[4vh] flex justify-center items-center">
            <Image
              width={50}
              height={50}
              alt="chick"
              src={"/images/chick.svg"}
              className="bg-white rounded-full"
            ></Image>
            {event.participants.length}
          </button>
        </div>
      </button>
      <div
       className="text-white text-[3.5vh] font-bold text-center"
      >{`${new Date(event.date).toLocaleDateString("en-US", {
        month: "numeric",
        day: "numeric",
      })} ${new Date("1970-01-01T" + event.time + "Z").toLocaleTimeString(
        "en-US",
        { hour: "numeric", minute: "numeric", hour12: true }
      )}`}</div>

      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            {event.title}
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            <span>
              {event.type} at {event.address}
            </span>
          </Typography>
        </Box>
      </Modal>
    </div>
  );
}
