import React from "react";
import { UploadImage } from "../components/uploadImage";
import "../css/Home.css";
// import EditImage from "../components/editImage";

export const Home = () => {
  return (
    <div className="Home">
      <h1>IMAGE PROCESSER</h1>
      <UploadImage />
    </div>
  );
};
