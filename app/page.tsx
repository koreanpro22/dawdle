"use client";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { auth, firestore, storage } from "../lib/firebase/config";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, sendPasswordResetEmail, signOut } from "firebase/auth";
import { selectUser } from "../lib/store/userSlice";
import { useSelector, useDispatch } from "react-redux";
import { setUser } from "../lib/store/userSlice";
import { doc, collection, addDoc, deleteDoc, updateDoc, arrayUnion, arrayRemove, getDoc, getDocs, query, where } from "firebase/firestore";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";

type Group = {
  id: string;
  name: string;
  author: string;
  participants: { id: string; email: string }[];
  events: any[]; 
  secret_key: string;
  imageUrl?: string;
};

export default function Landing() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState("");
  const [isLogin, setIsLogin] = useState(false); 
  const [groupName, setGroupName] = useState("");
  const [open, setOpen] = useState(false);
  const [secretKey, setSecretKey] = useState("");
  const [userGroups, setUserGroups] = useState<Group[]>([]);
  const audioRef = useRef<HTMLAudioElement>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [editOpen, setEditOpen] = useState(false);
  const [editGroup, setEditGroup] = useState<Group | null>(null);
  const user = useSelector(selectUser);
  const dispatch = useDispatch();

  const handleSubmit = () => {
    if (isLogin) {
      signInWithEmailAndPassword(auth, email, password).catch((error) => {
        const errorMessage = error.message;
        alert("Invalid Email or Password");
      });
    } else {
      createUserWithEmailAndPassword(auth, email, password).catch((error) => {
        const errorMessage = error.message;
        alert("Invalid Email or Password");
      });
    }
    setEmail("")
    setPassword("")
  };

  const handlePasswordReset = () => {
    const email = prompt("Please Enter Email");
    if (email) {
      sendPasswordResetEmail(auth, email)
        .then(() => alert("Email sent. Check inbox for password reset"))
        .catch((error) => {
          console.error(error);
          alert("Failed to send reset email");
        });
    }
  };

  const handleSignOut = () => {
    if (confirm("Are you sure you want to sign out?")) {
      signOut(auth)
        .then(() => {
          dispatch(setUser(null));
        })
        .catch((error) => {
          console.error(error);
          alert("Sign Out Failed");
        });
    }
  };

  useEffect(() => {
    if (user) {
      fetchUserGroups();
    }
  }, [user]);


  async function fetchUserGroups() {
    const qAuthor = query(collection(firestore, "groups"), where("author", "==", user.id));
    const qParticipant = query(collection(firestore, "groups"), where("participants", "array-contains", {
      id: user.id,
      email: user.email
    }));
    try {
      const [authorSnapshot, participantSnapshot] = await Promise.all([getDocs(qAuthor), getDocs(qParticipant)]);
      const groups: Group[] = [
        ...authorSnapshot.docs,
        ...participantSnapshot.docs
      ].map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          name: data.name || 'Unnamed Group', 
          author: data.author || '', 
          participants: data.participants || [],
          events: data.events || [], 
          secret_key: data.secret_key || '', 
          imageUrl: data.imageUrl || '',
        };
      });
  
      setUserGroups(groups);
    } catch (e) {
      console.error("Error fetching groups: ", e);
    }
  }
  // Show route for individual group pages
  // async function fetchUserGroup(groupId: string): Promise<Group | null> {
  //   try {
  //     const groupRef = doc(firestore, "groups", groupId);
      
  //     const groupDoc = await getDoc(groupRef);
  
  //     if (groupDoc.exists()) {
  //       const data = groupDoc.data();

  //       const group: Group = {
  //         id: groupDoc.id,
  //         name: data.name || 'Unnamed Group',
  //         author: data.author || '',
  //         participants: data.participants || [],
  //         events: data.events || [],
  //         secret_key: data.secret_key || '',
  //         imageUrl: data.imageUrl || '',
  //       };
  
  //       return group;
  //     } else {
  //       console.log("No such group!");
  //       return null;
  //     }
  //   } catch (e) {
  //     console.error("Error fetching group: ", e);
  //     return null;
  //   }
  // }

  function generateSecretKey(length = 8) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };
  

  async function createGroup() {
    let imageURL = "";

    if (imageFile) {
      const storageRef = ref(storage, `groups/${user?.id}/${Date.now()}_${imageFile.name}`);
      const uploadTask = await uploadBytes(storageRef, imageFile);
      imageURL = await getDownloadURL(uploadTask.ref);
    } 

    const groupData = {
        author: user?.id,
        name: groupName,
        events: [],
        participants: [],
        secret_key: generateSecretKey(),
        imageUrl: imageURL
    };

    try {
        const groupRef = await addDoc(collection(firestore, "groups"), groupData);
        fetchUserGroups()
        console.log("Group created with ID: ", groupRef.id);
        setOpen(false);
        setGroupName("");
        setImageFile(null);
        return groupRef.id;
    } catch (e) {
        console.error("Error adding document: ", e);
        throw new Error("Failed to create group");
    }
  }

  async function joinGroup() {
    const q = query(collection(firestore, "groups"), where("secret_key", "==", secretKey));

    try {
      const querySnapshot = await getDocs(q);
      if (querySnapshot.empty) {
        alert("No group found with that secret key.");
        return;
      }

      const groupDoc = querySnapshot.docs[0];
      const groupRef = groupDoc.ref;


      await updateDoc(groupRef, {
        participants: arrayUnion({
          id: user?.id,
          email: user?.email
        })
      });

      console.log("User added to group with ID: ", groupDoc.id);
      alert("Successfully joined the group!");
      handleClose(); 
      setSecretKey("")
      fetchUserGroups()

    } catch (e) {
      console.error("Error joining group: ", e);
      alert("Failed to join the group.");
    }
  }

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  async function deleteGroup(groupId: string) {
    if (confirm("Are you sure you want to delete this group? This action cannot be undone.")) {
      try {
        const groupRef = doc(firestore, "groups", groupId);
        await deleteDoc(groupRef);
        alert("Group deleted successfully.");
        fetchUserGroups(); 
      } catch (e) {
        console.error("Error deleting group: ", e);
        alert("Failed to delete group.");
      }
    }
  }

  async function leaveGroup(groupId: string) {
    if (confirm("Are you sure you want to leave this group?")) {
      try {
        const groupRef = doc(firestore, "groups", groupId);
        await updateDoc(groupRef, {
          participants: arrayRemove({
            id: user?.id,
            email: user?.email,
          }),
        });
        alert("You have left the group.");
        fetchUserGroups(); 
      } catch (e) {
        console.error("Error leaving group: ", e);
        alert("Failed to leave the group.");
      }
    }
  }

  const handleEditOpen = (group: Group) => {
    setEditGroup(group);
    setEditOpen(true);
  };

  const handleEditClose = () => {
    setEditGroup(null);
    setEditOpen(false);
  };

  async function updateGroup() {
    let imageURL = editGroup?.imageUrl || "";

    if (imageFile) {
      const storageRef = ref(storage, `groups/${user?.id}/${Date.now()}_${imageFile.name}`);
      const uploadTask = await uploadBytes(storageRef, imageFile);
      imageURL = await getDownloadURL(uploadTask.ref);
    }

    if (editGroup) {
      const groupRef = doc(firestore, "groups", editGroup.id);
      try {
        await updateDoc(groupRef, {
          name: groupName || editGroup.name,
          imageUrl: imageURL,
        });
        alert("Group updated successfully.");
        fetchUserGroups();
        handleEditClose();
      } catch (e) {
        console.error("Error updating group: ", e);
        alert("Failed to update group.");
      }
    }
  }

  async function removeParticipant(participantId: string) {
    if (editGroup) {
      const updatedParticipants = editGroup.participants.filter(participant => participant.id !== participantId);
      setEditGroup({ ...editGroup, participants: updatedParticipants });
  
      const groupRef = doc(firestore, "groups", editGroup.id);
      try {
        await updateDoc(groupRef, {
          participants: arrayRemove({
            id: participantId,
            email: editGroup.participants.find(p => p.id === participantId)?.email
          }),
        });
        alert("Participant removed successfully.");
        fetchUserGroups(); // Refresh the group list
      } catch (e) {
        console.error("Error removing participant: ", e);
        alert("Failed to remove participant.");
        // Revert optimistic update if the operation fails
        setEditGroup(prev => prev ? { ...prev, participants: editGroup.participants } : null);
      }
    }
  }
  

  if (user) {
    return (
      <div className="flex flex-col justify-center items-center h-screen">
        <button
          className="bg-red-600 text-white text-3xl py-5 px-10 rounded-full mb-4"
          onClick={handleSignOut}
        >
          Sign Out
        </button>
        <Button 
          variant="contained" 
          color="primary" 
          onClick={handleOpen}
          style={{ fontSize: '2rem' }}
        >
          +
        </Button>
        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="create-group-modal"
          aria-describedby="modal-to-create-group"
        >
          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: 400,
              bgcolor: 'background.paper',
              boxShadow: 24,
              p: 4,
              borderRadius: 2,
              display: 'flex',
              flexDirection: 'column',
              gap: 2
            }}
          >
            <h2 id="create-group-modal">Create a New Group</h2>
            <TextField 
              label="Group Name" 
              variant="outlined" 
              fullWidth 
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
            />
              <input 
              type="file" 
              accept="image/*" 
              onChange={handleFileChange} 
            />
            <Button 
              variant="contained" 
              color="primary" 
              onClick={createGroup}
            >
              Create Group
            </Button>
            <h2>Or Join a Group</h2>
            <TextField
              label="Secret Key"
              variant="outlined"
              fullWidth
              value={secretKey}
              onChange={(e) => setSecretKey(e.target.value)}
            />
            <Button
              variant="contained"
              color="secondary"
              onClick={joinGroup}
            >
              Join Group
            </Button>
          </Box>
        </Modal>
        <div className="mt-4">
          <h3 className="text-2xl font-bold mb-2">Your Groups</h3>
          <ul>
            {userGroups?.map((group) => (
              <li key={group?.id} className="text-xl mb-1">
                <p>{group.name}</p>
                <br />
                <p>{group.secret_key}</p>
                {group.imageUrl && (
                  <Image
                    src={group.imageUrl}
                    alt={`${group.name} Image`}
                    width={200}
                    height={200}
                    objectFit="cover"
                  />
                )}
                {group.author === user?.id && (
                  <>
                    <Button
                      variant="contained"
                      color="error"
                      onClick={() => deleteGroup(group.id)}
                    >
                      Delete Group
                    </Button>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => handleEditOpen(group)}
                    >
                      Edit
                    </Button>
                  </>
                )}
                {group.author !== user?.id && (
                  <>
                    <Button
                      variant="contained"
                      color="error"
                      onClick={() => leaveGroup(group.id)}
                    >
                      Leave Group
                    </Button>
                  </>
                )}
                <Modal
                  open={editOpen && editGroup?.id === group.id}
                  onClose={handleEditClose}
                  aria-labelledby="edit-group-modal"
                  aria-describedby="modal-to-edit-group"
                >
                  <Box
                    sx={{
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      transform: 'translate(-50%, -50%)',
                      width: 400,
                      bgcolor: 'background.paper',
                      boxShadow: 24,
                      p: 4,
                      borderRadius: 2,
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 2
                    }}
                  >
                    <h2 id="edit-group-modal">Edit Group</h2>
                    <TextField
                      label="Group Name"
                      variant="outlined"
                      fullWidth
                      value={editGroup?.name || ''}
                      onChange={(e) => setEditGroup(prev => prev ? { ...prev, name: e.target.value } : null)}
                    />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                    />
                    <h3>Participants</h3>
                    <ul>
                      {editGroup?.participants.map(participant => (
                        <li key={participant.id} className="flex justify-between items-center">
                          <span>{participant.email}</span>
                          <Button
                            variant="contained"
                            color="error"
                            onClick={() => removeParticipant(participant.id)}
                          >
                            Remove
                          </Button>
                        </li>
                      ))}
                    </ul>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={updateGroup}
                    >
                      Update Group
                    </Button>
                  </Box>
                </Modal>
              </li>
            ))}
          </ul>
        </div>
      </div>
    )
  }


  return (
    <div className="lg:w-[90%] flex flex-col lg:flex-row m-auto lg:h-screen p-[3vh] max-h-[100dvh] h-[100dvh] overflow-hidden">
      <div className="lg:my-auto mx-auto flex flex-col lg:justify-center">
        <audio
          ref={audioRef}
          src="/quack.mp3"
          preload="auto"
        ></audio>

        <h1 className="animate-fadeIn lg:m-auto text-[6.5vh] lg:text-[7vh] text-primary-text-color font-[800]">
          Connect,
          <br />
          plan, and experience.
          <br />
          All in one
          <br />
          place.
        </h1>
        <div className="w-[95%] text-primary-accent-color font-bold -ml-[2vh] lg:ml-0 my-5">
          <h2 className="lg:w-[100%] animate-fadeIn text-[10vh] lg:text-[20vh] tracking-[-0.1em] font-[900] lg:pl-5">
            10,000
          </h2>
          <p className="leading-[4rem] -mt-[6vh] lg:mt-0 lg:text-right animate-fadeIn lg:text-[3vh] text-[8vh] font-[800] lg:mr-0">
            <span className="text-white">ducks </span>
            are Dawdling
          </p>
        </div>
        <div className="z-10 w-[80%] lg:my-0 lg:mx-0 mx-auto flex flex-col gap-3 my-5 pb-5">
          <p
            className="text-primary-text-color lg:self-start self-center underline underline-offset-2 cursor-pointer"
            onClick={() => setIsLogin(!isLogin)}
          >
            {isLogin ? "Become one of them!" : "Are you one of them?"}
          </p>
          <div className="flex lg:flex-row lg:w-full justify-center lg:gap-[2vh] gap-[1vh] relative">
            <input
              className="placeholder:text-[#8A58FF] text-[#360F50] flex-1 animate-fadeIn outline-none transition-all ease-in-out duration-300 hover:bg-hover-color focus:bg-hover-color px-5 rounded-full py-5 bg-secondary-accent-color"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="email"
            />
            <input
              className="animate-fadeIn outline-none transition-all ease-in-out duration-300 hover:bg-hover-color focus:bg-hover-color px-5 placeholder:text-black rounded-full py-5 bg-secondary-accent-color"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
            />
            <button
              className="animate-fadeIn self-end bg-primary-accent-color text-primary-text-color w-min py-3 px-5 rounded-full"
              type="submit"
              onClick={handleSubmit}
            >
              {isLogin ? "Login" : "Sign Up"}
            </button>
          </div>
          {isLogin && (
            <button
              className="mt-3 text-primary-text-color underline cursor-pointer"
              onClick={handlePasswordReset}
            >
              Forgot Password?
            </button>
          )}
        </div>
      </div>

      <div className="animate-swim lg:animate-none lg:flex animation-3d lg:w-[40%] w-[90%] m-auto lg:my-auto mx-auto rotate-[-2deg]">
        <h2 className="text-center font-[900] text-2xl text-primary-accent-color my-2">
          27th Saturday 5:00PM
        </h2>
        <div className="w-[90%] mx-auto relative ">
          <div className="absolute bg-primary-accent-color py-2 px-3 rounded-full top-0 left-0 -translate-x-5 -translate-y-2">
            <div className="flex gap-1">
              <div className="rounded-full bg-white p-1">🦆</div>
              <div className="rounded-full bg-white p-1">🐤</div>
              <div className="rounded-full bg-white p-1">🐤</div>
              <div className="rounded-full bg-white p-1">🐤</div>
              <div className="rounded-full bg-white p-1">🐤</div>
            </div>
          </div>
          <div className="">
            <Image
              src="/images/landing-page.png"
              width={0}
              height={0}
              alt="Picture of the author"
              sizes="100vw"
              className=" w-full h-auto rounded-xl"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
