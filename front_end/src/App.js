import "./App.css";
import { useState } from "react";
import Alert from "@mui/material/Alert";
import axios from "axios";
import CircularProgress from "@mui/material/CircularProgress";

function App() {
  const [selectedFile, setselectedFile] = useState();
  const [isFileUplaoded, setisFileUplaoded] = useState(false);
  const [uplaodingFile, setuplaodingFile] = useState(false);

  // On file select (from the pop up)
  const onFileChange = (event) => {
    // Update the state
    console.log(event, "event");
    setselectedFile(event.target.files[0]);
  };
  const uploadFile = async () => {
    setuplaodingFile(true);
    const form_data = new FormData();
    form_data.append("singleImage", selectedFile);

    let reqObj = {
      method: "POST",
      url: "http://localhost:5000/singleFile",
      data: form_data,
    };
    let results = await axios(reqObj);
    if (results.status == 200) {
      setisFileUplaoded(true);
      setselectedFile(null);
      setuplaodingFile(false);
    }
  };
  if (uplaodingFile == true) {
    return <CircularProgress style={{ marginLeft: "50%", marginTop: "10%" }} />;
  }

  if (selectedFile) {
    return (
      <div>
        {isFileUplaoded ? (
          <Alert severity="success" color="info">
            This is a success alert — check it out!
          </Alert>
        ) : null}
        <h1 style={{ textAlign: "center" }}>Send File to flask</h1>
        <h2>File Details:</h2>
        <p>File Name: {selectedFile.name}</p>
        <p>File Type: {selectedFile.type}</p>
        <p>Last Modified: {selectedFile.lastModifiedDate.toDateString()}</p>
        <button onClick={() => uploadFile()}>Send!</button>
      </div>
    );
  } else {
    return (
      <div>
        {isFileUplaoded ? (
          <Alert severity="success" color="info">
            File uplaod success fully
          </Alert>
        ) : null}
        <h1 style={{ textAlign: "center" }}>Send File to flask</h1>
        <br />
        <h4>Choose before Pressing the Upload button</h4>
        <input type="file" onChange={(event) => onFileChange(event)} />
      </div>
    );
  }
}
export default App;
