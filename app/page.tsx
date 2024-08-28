'use client'
import Image from "next/image";
import { useState, useEffect } from "react";
import { auth, firestore } from "../lib/firebase/config";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, sendPasswordResetEmail, signOut } from "firebase/auth";
import { selectUser } from "../lib/store/userSlice";
import { useSelector, useDispatch } from "react-redux";
import { setUser } from "../lib/store/userSlice";
import { addDoc, collection, query, where, getDocs, updateDoc, arrayUnion } from "firebase/firestore";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";

type Group = {
  id: string;
  name: string;
  author: string;
  participants: { id: string; email: string }[];
  events: any[]; // Adjust this type based on the structure of your `events` field
  secret_key: string;
  // Add other properties as necessary
};

export default function Landing() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState("");
  const [isLogin, setIsLogin] = useState(false); 
  const [groupName, setGroupName] = useState("");
  const [open, setOpen] = useState(false);
  const [secretKey, setSecretKey] = useState("");
  const [userGroups, setUserGroups] = useState<Group[]>([]);
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
          name: data.name || 'Unnamed Group', // Provide a default value if name is missing
          author: data.author || '', // Default if author is missing
          participants: data.participants || [], // Default to empty array if participants are missing
          events: data.events || [], // Default to empty array if events are missing
          secret_key: data.secret_key || '', // Default if secret_key is missing
          // Include other properties as necessary
        };
      });
  
      setUserGroups(groups);
    } catch (e) {
      console.error("Error fetching groups: ", e);
    }
  }

  function generateSecretKey(length = 8) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }

  async function createGroup() {
    const groupData = {
        author: user?.id,
        name: groupName,
        events: [],
        participants: [],
        secret_key: generateSecretKey(),
    };

    try {
        const groupRef = await addDoc(collection(firestore, "groups"), groupData);
        console.log("Group created with ID: ", groupRef.id);
        setOpen(false);
        setGroupName("");
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

    } catch (e) {
      console.error("Error joining group: ", e);
      alert("Failed to join the group.");
    }
  }

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

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
            {userGroups?.map(group => (
              <li key={group?.id} className="text-xl mb-1">
                {group.name}
                <br />
                {group.secret_key}
              </li>
            ))}
          </ul>
        </div>
      </div>
    )
  }


  return (
    <div className="flex flex-col lg:flex-row w-[80%] m-auto lg:h-screen py-[1vh]">
      <div className="h-full lg:my-auto mx-auto flex flex-col lg:justify-center">
        <h1 className="animate-fadeIn text-[6vh] lg:text-[7vh] text-primary-text-color font-[900]">
          Connect, plan, and experience. All in one place.
        </h1>
        <div className="w-[95%] text-primary-accent-color font-bold -ml-[2vh] lg:ml-0 my-5">
          <h2 className="lg:w-[100%] animate-fadeIn text-[10vh] lg:text-[20vh] tracking-[-0.1em] font-[900] lg:pl-5">
            10,000
          </h2>
          <p className="lg:w-[61%] animate-fadeIn text-right text-[3.25vh] lg:text-[4vh] font-[900] -mr-[2vh] lg:mr-0">users are Dawdling</p>
        </div>
        <div className="w-[80%] lg:my-0 lg:mx-0 mx-auto flex flex-col gap-3 my-5 pb-5">
          <p
            className="text-primary-text-color lg:self-start self-end underline underline-offset-2 cursor-pointer"
            onClick={() => setIsLogin(!isLogin)} // Toggle between login and signup
          >
            {isLogin ? "Become one of them!" : "Are you one of them?"}
          </p>
          <div className="flex lg:flex-row flex-col justify-start lg:gap-[2vh] gap-[1vh]">
            <input
              className="animate-fadeIn outline-none transition-all ease-in-out duration-300 hover:bg-hover-color focus:bg-hover-color px-5 placeholder:text-black rounded-full py-5 bg-secondary-accent-color"
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
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

      <div className="animation-3d w-[80%] lg:my-auto mx-auto rotate-[-2deg]">
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
              alt="Landing Page Image"
              sizes="100vw"
              className="w-full h-auto rounded-xl"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
