import axios from "axios";
import React, { useState } from "react";
import EditImage from "./editImage";

export const UploadImage = () => {
  const [preview, setPreview] = useState("");
  const [uuid, setUuid] = useState("");

  const apiUrl = process.env.REACT_APP_API_URL;
  console.log("apiUrl ", apiUrl);

  const fileChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      // setFile(e.target.files[0]);
      uploadFile(e.target.files[0]);
    }
    hideEdit();
  };

  let first: any;
  let editor: any;
  let home: any;
  let uploader: any;
  let uploaderback: any;

  const findbyID = () => {
    first = document.getElementById("first-preview");
    editor = document.getElementById("editer-container");
    home = document.getElementsByClassName("Home")[0];
    uploader = document.getElementById("uploader");
    uploaderback = document.getElementById("uploader-back");
  };

  const showPreview = () => {
    findbyID();
    home.style.padding = "0 10%";
    uploader.style.transform = "rotateY(90deg)";
    setTimeout(() => {
      uploaderback.style.transform = "rotateY(0deg)";
    }, 250);
    setTimeout(() => {
      first.style.transform = "scale(1.7)";
    }, 1000);
  };

  const getHome = () => {
    findbyID();
    hideEdit();
    uploaderback.style.transform = "rotateY(-90deg)";
    setTimeout(() => {
      uploader.style.transform = "rotateY(0deg)";
      home.style.padding = "0 30%";
    }, 250);
  };

  const showEdit = () => {
    findbyID();
    setTimeout(() => {
      editor.style.transform = "scale(1)";
    }, 1000);
  };

  const hideEdit = () => {
    findbyID();
    if (editor && first) {
      editor.style.transform = "scale(0)";
      first.style.transform = "scale(0)";
    }
  };

  interface UploadResponse {
    message: string;
    preview: string;
    path: string;
    uuid: string;
  }

  const uploadFile = async (file: File) => {
    if (file) {
      const formData = new FormData();
      formData.append("image", file);

      console.log(formData);
      try {
        // const response = await axios.post<UploadResponse>(
        //   "http://localhost:5000/api/upload",
        //   formData,
        //   {
        //     headers: {
        //       "Content-Type": "multipart/form-data",
        //     },
        //   }
        // );
        const response = await axios.post<UploadResponse>(
          `${process.env.REACT_APP_API_URL}/api/upload`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        setPreview(response.data.preview);
        setUuid(response.data.uuid);
        showPreview();
        showEdit();

        console.log(response);
      } catch (error) {
        console.error("Error uploading file:", error);
      }
    } else {
      console.log("No file Selected");
    }
  };

  return (
    <div className="host">
      <div id="uploader" className="container">
        <input
          type="file"
          accept="image/*"
          name="image"
          onClick={getHome}
          onChange={(e) => fileChanged(e)}
        />
      </div>
      <div id="uploader-back">
        <h2>Upload another Image for Edit</h2>
        <button onClick={getHome}>New Upload</button>
      </div>

      <img id="first-preview" src={preview} alt="Preview"></img>
      <EditImage preview={preview} setPreview={setPreview} uuid={uuid} />
    </div>
  );
};
