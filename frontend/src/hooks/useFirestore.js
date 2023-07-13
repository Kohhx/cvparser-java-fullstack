import { useReducer, useEffect, useState } from 'react'
import { projectFirestore, timestamp } from '../firebase/config'

let initialState = {
  document: null,
  isPending: false,
  error: null,
  success: null
}

const firestoreReducer = (state, action) => {
  switch (action.type) {
    case 'IS_PENDING':
      return { isPending: true, document: null, error: null, success: false }
    case 'ADDED_DOCUMENT':
      return { ...state, isPending: false, document: action.payload, success: true, error: null }
    case 'ERROR':
      return { ...state, isPending: false, error: action.payload, success: false }
    default:
      return state;
  }
}

export const useFirestore = async (collection) => {
  const [response, dispatch] = useReducer(firestoreReducer, initialState);
  const [isCancelled, setIsCancelled] = useState(false);

  // collection ref
  const ref = projectFirestore.collection(collection);

  // Only dispatch if not cancelled
  const dispatchIfNotCancelled = (action) => {
    if (!isCancelled) {
      dispatch(action)
    }
  }

  // Add document
  const addDocument = async (doc) => {
    dispatch({ type: 'IS_PENDING' })
    try {
      // Create a timestamp
      const createdAt = timestamp.fromDate(new Date());
      const addedDocument = await ref.add({...doc, createdAt});
      dispatchIfNotCancelled({
        type: 'ADDED_DOCUMENT',
        payload: addedDocument
      })
    } catch (error) {
      dispatchIfNotCancelled({
        type: 'ERROR',
        payload: error.message
      })
    }
  }


  // Delete document
  const deleteDocument = async (id) => {

  }


  // Do not change state if component is unmounted
  useEffect(() => {
    return () => setIsCancelled(true);
  }, [])


  return { ...response, addDocument, deleteDocument }
}
