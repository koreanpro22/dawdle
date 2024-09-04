import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import { useState } from "react";
import { joinGroup } from "@/app/lib/groupActions";

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

export default function JoinGroupModal() {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [secretKey, setSecretKey] = useState("");

  return (
    <div>
      <button
        className="bg-white text-[#8A58FF] focus:text-[#ffffff] hover:text-[#ffffff] transition-all hover:bg-[#8A58FF] focus:bg-[#8A58FF] ease-in-out font-semibold w-full text-[2vh] rounded-full px-[1vh] py-[1vh]"
        onClick={handleOpen}
      >
        Join Group
      </button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <div className="flex flex-col bg-[#8A58FF] py-[3vh] left-0 bottom-0 absolute w-full z-10">
          <div className="flex flex-col gap-[3vh] w-[65%] m-auto ">
            <div className="flex">
              <h1
                onClick={handleClose}
                className="ml-[2vh] text-[3vh] text-white absolute left-0"
              >
                x
              </h1>
              <h1 className="text-[3vh] text-white m-auto">Join group</h1>
            </div>
            <div className="flex flex-col m-auto w-full">
              <label htmlFor="code" className="text-white">
                code
              </label>
              <input
                id="code"
                className="rounded-[1vh] p-[1vh]"
                type="text"
                aria-label="name"
                value={secretKey}
                onChange={(e) => setSecretKey(e.target.value)}
              />
            </div>

            <button
              onClick={() => joinGroup(secretKey)}
              className="bg-white w-fit m-auto px-[3vh] py-[1vh] rounded-[2vh] text-[3vh] text-[#8A58FF]"
            >
              join
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
