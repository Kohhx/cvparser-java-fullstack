import { useReducer, useEffect, useState } from "react";
import { projectFirestore, timestamp } from "../firebase/config";
import { projectStorage } from "../firebase/config";
import { v4 as uuidv4 } from "uuid";

let initialState = {
  document: null,
  isPending: false,
  error: null,
  success: null,
};

const firestoreReducer = (state, action) => {
  switch (action.type) {
    case "IS_PENDING":
      return { isPending: true, document: null, error: null, success: false };
    case "ADDED_DOCUMENT":
      return {
        ...state,
        isPending: false,
        document: action.payload,
        success: true,
        error: null,
      };
    case "DELETED_DOCUMENT":
      return {
        ...state,
        isPending: false,
        document: action.payload,
        success: true,
        error: null,
      };
    case "ERROR":
      return {
        ...state,
        isPending: false,
        error: action.payload,
        success: false,
      };
    default:
      return state;
  }
};

export const useFirestoreImage = (uid, collection) => {
  const [response, dispatch] = useReducer(firestoreReducer, initialState);
  const [isCancelled, setIsCancelled] = useState(false);

  // Get User collection
  const userRef = projectFirestore.collection("users").doc(uid);

  // Only dispatch if not cancelled
  const dispatchIfNotCancelled = (action) => {
    if (!isCancelled) {
      dispatch(action);
    }
  };

  // Get All images
  const getAllImages = async () => {
    dispatch({ type: "IS_PENDING" });
    try {
      const allImages = await userRef
        .collection(collection)
        // .orderBy("imgDate", "desc")
        .get();
      const images = allImages.docs.map((doc) => {
        return { ...doc.data(), id: doc.id };
      });

      dispatchIfNotCancelled({
        type: "ADDED_DOCUMENT",
        payload: images,
      });
      return images;
    } catch (error) {
      dispatchIfNotCancelled({
        type: "ERROR",
        payload: error.message,
      });
    }
  };

  // Add document
  const addImageDocument = async (doc) => {
    dispatch({ type: "IS_PENDING" });
    const imageFile = doc.imageFile;
    // Upload user profile image
    const uploadPath = `userImages/${uid}/${uuidv4()}_${imageFile.name}`;
    const img = await projectStorage.ref(uploadPath).put(imageFile);
    const imgUrl = await img.ref.getDownloadURL();

    const imageDoc = {
      caption: doc.caption,
      imgUrl,
      imgDate: doc.imageDate,
      imgId: img.ref.fullPath,
    };

    try {
      // Create a timestamp
      const createdAt = timestamp.fromDate(new Date());
      const addedDocument = await userRef
        .collection(collection)
        .add({ ...imageDoc, createdAt });
      dispatchIfNotCancelled({
        type: "ADDED_DOCUMENT",
        payload: addedDocument,
      });
      console.log("Added photo");
    } catch (error) {
      console.log(error);
      dispatchIfNotCancelled({
        type: "ERROR",
        payload: error.message,
      });
    }
  };

  // Delete document
  const deleteImage = async (id) => {
    dispatch({ type: "IS_PENDING" });
    try {
      const doc = await userRef.collection(collection).doc(id).get();
      const imgPath = doc.data().imgId;
      await projectStorage.ref(imgPath).delete();
      const updatedDocument = await userRef
        .collection(collection)
        .doc(id)
        .delete();
      dispatchIfNotCancelled({
        type: "DELETED_DOCUMENT",
        payload: updatedDocument,
      });
    } catch (error) {
      dispatchIfNotCancelled({
        type: "ERROR",
        payload: error.message,
      });
    }
  };

  // Do not change state if component is unmounted
  useEffect(() => {
    return () => setIsCancelled(true);
  }, []);

  return { ...response, addImageDocument, deleteImage, getAllImages };
};
