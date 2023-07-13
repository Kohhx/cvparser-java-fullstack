import { projectStorage } from "../firebase/config";

export const fileUtil = {
  firebaseFileDownload: async (ref) => {
    console.log("ref: ",ref)
    const fileRef = projectStorage.ref(ref);
    const name = fileRef.name;
    const downloadURL = await fileRef.getDownloadURL();
    console.log(downloadURL);
    const response = await fetch(downloadURL, {
      method: "GET",
      headers: {
        Accept: "application/octet-stream",
      },
    });
    const file = await response.blob();
    const blobUrl = URL.createObjectURL(file);
    const link = document.createElement("a");
    link.href = blobUrl;
    link.download = name; // Specify the desired filename for the downloaded image
    link.click();
    link.remove();
  }

}
