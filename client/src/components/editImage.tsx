import React, { useEffect, useState } from "react";
import axios from "axios";

interface EditProps {
  preview: string;
  setPreview: (value: string) => void;
  uuid: string;
}

const EditImage = ({ setPreview, uuid }: EditProps) => {
  const [brightness, setBrightness] = useState(1);
  const [contrastLow, setContrastLow] = useState(1);
  const [contrastHigh, setContrastHigh] = useState(2);
  const [saturation, setSaturation] = useState(1);
  const [rotate, setRotate] = useState(0);
  const [hue, setHue] = useState(90);
  const [format, setFormat] = useState("jpeg");
  const [downloadUrl, setDownloadUrl] = useState("");

  const editImage = async () => {
    const formData = new FormData();
    formData.append("uuid", uuid);
    formData.append("brightness", brightness.toString());
    formData.append("hue", hue.toString());
    formData.append("saturation", saturation.toString());
    formData.append("contrastLow", contrastLow.toString());
    formData.append("contrastHigh", contrastHigh.toString());
    formData.append("format", format);
    formData.append("rotate", rotate.toString());

    console.log(formData);

    interface EditImageResponse {
      message: string;
      preview: string;
      path: string;
      downloadPath: string;
    }

    try {
      // const response = await axios.post<EditImageResponse>(
      //   "http://localhost:5000/api/edit",
      //   formData,
      //   {
      //     headers: {
      //       "Content-Type": "multipart/form-data",
      //     },
      //   }
      // );
      const response = await axios.post<EditImageResponse>(
        `${process.env.REACT_APP_API_URL}/api/edit`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setPreview(response.data.preview);
      // const downloadUrl = `http://localhost:5000/api${response.data.downloadPath}`;
      const downloadUrl = `${process.env.REACT_APP_API_URL}/api${response.data.downloadPath}`;

      // Store the download URL for use
      setDownloadUrl(downloadUrl);
    } catch (error) {
      console.error("Error adjusting image:", error);
    }
  };

  const downloadImage = () => {
    if (downloadUrl) {
      window.open(downloadUrl, "_blank");
    }
  };

  return (
    <div className="container" id="editer-container">
      <div className="form-holder">
        <label>Brightness</label>
        <p>{brightness}</p>

        <input
          type="range"
          min="0.5"
          max="2"
          step="0.1"
          value={brightness}
          onChange={(e) => setBrightness(parseFloat(e.target.value))}
        />
      </div>
      {/* <div className="form-holder">
        <label>Hue</label>
        <input
          type="range"
          min="0"
          max="360"
          step="40"
          value={hue}
          onChange={(e) => setHue(parseFloat(e.target.value))}
        />
      </div> */}
      <div className="form-holder" id="contrast-holder">
        <label>contrast</label>
        <div style={{ display: "flex" }}>
          <div className="contrast-input">
            <input
              type="range"
              min="0"
              max="99"
              step="2"
              value={contrastLow}
              onChange={(e) => setContrastLow(parseFloat(e.target.value))}
            />
            <p>Lower Value</p>
          </div>
          <div className="contrast-input">
            <input
              type="range"
              min="1"
              max="100"
              step="2"
              value={contrastHigh}
              onChange={(e) => setContrastHigh(parseFloat(e.target.value))}
            />
            <p>Higher Value</p>
          </div>
        </div>
      </div>
      <div className="form-holder">
        <label>Saturation</label>
        <p> {saturation}</p>
        <input
          type="range"
          min="0.5"
          max="2"
          step="0.1"
          value={saturation}
          onChange={(e) => setSaturation(parseFloat(e.target.value))}
        />
      </div>
      <div className="form-holder">
        <label>Rotation</label>
        <p>{rotate} deg</p>
        <input
          type="range"
          min="0"
          max="360"
          step={1}
          value={rotate}
          onChange={(e) => setRotate(parseInt(e.target.value))}
        />
      </div>
      <div className="form-holder">
        <label>Format</label>
        <select value={format} onChange={(e) => setFormat(e.target.value)}>
          <option value="jpeg">JPEG</option>
          <option value="png">PNG</option>
        </select>
      </div>
      <div style={{ display: "flex", gap: "60px" }}>
        <button onClick={downloadImage} className="download-btn">
          Download
        </button>
        <button onClick={editImage}>Apply Edits</button>
      </div>
    </div>
  );
};

export default EditImage;
