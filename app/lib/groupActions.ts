import { Query, collection, getDocs, updateDoc, arrayUnion, where, query } from "firebase/firestore";
import { firestore, storage } from "@/lib/firebase/config";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";


export async function createGroup() {

    function generateSecretKey(length = 8) {
    const characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let result = "";
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }
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


export async function joinGroup(secretKey: string) {
    const q = query(
      collection(firestore, "groups"),
      where("secret_key", "==", secretKey)
    );

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
          email: user?.email,
        }),
      });

      alert("Successfully joined the group!");
      handleClose(); 
      setSecretKey("")
      fetchUserGroups()

    } catch (e) {
      console.error("Error joining group: ", e);
      alert("Failed to join the group.");
    }
  }