import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";

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
  address: string;
  participants: string[];
  title: string;
  type: string;
  name: string;
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
      <button className="bg-[#8A58FF] rounded-[1vh] p-[1vh] relative">
        <div className="flex items-center gap-[1vh]" onClick={handleOpen}>
          <div className="flex flex-col">
            <p className="text-white font-semibold text-[2.25vh]">
              {event.title}
            </p>
            {/* {group.secret_key} */}
          </div>
        </div>
      </button>
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
