const uploadFile = async (file: File) => {
  try {
    if (!file) {
      alert("No file selected");
      return;
    }

    const data = new FormData();
    data.set("file", file);

    const uploadRequest = await fetch("/api/files", {
      method: "POST",
      body: data,
    });

    const signedUrl = await uploadRequest.json();
    return signedUrl;
  } catch (e) {
    console.error("Error uploading file:", e);
    return null;
  }
};
