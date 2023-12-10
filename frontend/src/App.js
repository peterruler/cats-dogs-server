import "./App.css";
import { useState, useRef } from "react";

// Change Server URI here:
const endpointURI = 'http://keepitnative.xyz:5000';

const Loader = () => {
  return (
    <div className="loader">
      <img src="./loading.gif" alt="loading gif" width="64" height="66" />
    </div>
  );
};

function App() {
  const [image, setImage] = useState({ preview: "", data: "" });
  const [status, setStatus] = useState("");
  const handleSubmit = async (e) => {
    e.preventDefault();

    let formData = new FormData();
    formData.append("file", image.data);
    const response = await fetch(`${endpointURI}/upload`, {
      method: "POST",
      body: formData,
    });
    if (response) {
      displayLoader("hide");
      setStatus(`${response.statusText}`);
    }
  };

  const handleFileChange = (e) => {
    const img = {
      preview: URL.createObjectURL(e.target.files[0]),
      data: e.target.files[0],
    };
    setImage(img);
    displayLoader("show");
    setTimeout(function() {
      triggerSubmit();
    }, 2000);
  };

  const refSubmitButtom = useRef(null);

  const triggerSubmit = () => {
    refSubmitButtom.current.click();
  };

  const displayLoader = (flag) => {
    let showHide = "hidden";
    if (flag === "show") {
      showHide = "visible"; // hidden
    }
    document.querySelector(".loader").style.visibility = showHide;
  };

  return (
    <>
      <Loader />
      <div className="App">
        <h1>Katzen & Hunde Erkennung</h1>
        <div id="preview">
          {image.preview && (
            <img src={image.preview} width="100" height="100" />
          )}
        </div>
        <form id="form" onSubmit={handleSubmit} encType="multipart/form-data">
          <main>
            <label className="fileContainer">
              Bild aufnehmen
              <input
                id="image-file-choose"
                type="file"
                accept="image/*"
                capture="user/"
                onChange={handleFileChange}
              />
            </label>
          </main>
          <button hidden={true} ref={refSubmitButtom} type={"submit"} />
        </form>
        <div id="status">{status && <h4>{status}</h4>}</div>
      </div>
    </>
  );
}

export default App;
