import "././styles/App.css";
import firebase from "./firebase.js";
import React from "react";
import Header from "./Components/Header.js";
// import DatePicker from "react-datepicker";
// import "react-datepicker/dist/react-datepicker.css";
import Prompts from "./Components/Prompts"
import Footer from "./Components/Footer";
import { useEffect, useState } from "react";

function App() {
  const [intentionArray, setIntentionArray] = useState([]);
  const [handleDate, setHandleDate] = useState(null);
  const [textInput, setTextInput] = useState("");
  const [textExpand, setTextExpand] = useState("");
  const [textInputErr, setTextInputErr] = useState({});

  useEffect(() => {
    const dbRef = firebase.database().ref();

    dbRef.on("value", (data) => {
      const intentionData = data.val();
      const intentionsInState = [];

      for (let intentionKey in intentionData) {
        intentionsInState.push({
          uniqueKey: intentionKey,
          todaysDate: intentionData[intentionKey].date,
          intention: intentionData[intentionKey].text,
          intentionDesc: intentionData[intentionKey].textExpand,
        });
      }
      setIntentionArray(intentionsInState);
    });
  }, []);

  const handleChange = (event) => {
    setTextInput(event.target.value);
  };

  const handleTextExpand = (event) => {
    setTextExpand(event.target.value);
  }

  const handleSubmit = (event) => {
    event.preventDefault();

    const dbRef = firebase.database().ref();
    const isValid = formValidation();
    const date = handleDate;

    const dataObject = {
      date: date,
      text: textInput,
      textExpand: textExpand,
    };

    if (isValid) {
      dbRef.push(dataObject);
      setTextInput("");
      setTextExpand("");
      setHandleDate(null);
    }
  };

  const formValidation = () => {
    const textInputErr = {};
    let isValid = true;
    if (textInput.trim().length < 4) {
      textInputErr.textInputShort = "Please type a full word to continue.";
      isValid = false;
    }
    if (textInput.trim().length > 20) {
      textInputErr.textInputLong = "Please only type one to two words.";
      isValid = false;
    }
    setTextInputErr(textInputErr);
    return isValid;
  };

  const handleClick = (itemUniqueId) => {
    const dbRef = firebase.database().ref();
    dbRef.child(itemUniqueId).remove();
  };

  return (
    <div>
      <Header />
      <main className="wrapper">
        <section className="input">
          <form className="intentionForm" onSubmit={handleSubmit}>
            <div className="calendar">
              <label
                htmlFor="date"
                className="intentionLabel"
                id="intentionDate"
              >
                <h3>Today's Date:</h3>
              </label>
              <input
                aria-describedby="intention-date"
                type="date"
                className="date"
                required
                value={handleDate}
                selected={handleDate}
                onChange={(e) => setHandleDate(e.target.value)}
              />
            </div>
            <label
              className="intentionLabel"
              id="intentionLabel"
              htmlFor="intentionInput"
            >
              <h3>
                What intention (in one or two words) would you like to move
                through the coming day with? I.e. Presence.
              </h3>
            </label>
            <input
              aria-describedby="intention-label"
              className="intentionInput"
              type="text"
              id="intentionInput"
              onChange={handleChange}
              value={textInput}
            />
            {Object.keys(textInputErr).map((key) => {
              return <div style={{ color: "red" }}>{textInputErr[key]}</div>;
            })}
            <label
              className="intentionLabel"
              id="intentionDescription"
              htmlFor="intentionInput"
            >
              <h3>If you'd like, expand on your intention.</h3>
            </label>
            <textarea
              aria-describedby="intention-description"
              value={textExpand}
              className="textExpand"
              id="textExpand"
              name="description"
              maxLength="300"
              onChange={handleTextExpand}
            ></textarea>
            <button className="submitButton">Remember</button>
          </form>
          <Prompts />
        </section>
        <section className="intentionLogs">
          <ul className="intentionLogList">
            {intentionArray.map((item) => {
              return (
                <li key={item.uniqueKey}>
                  <span className="date">{item.todaysDate} </span>
                  <span className="intention">{item.intention}</span>
                  <span className="textExpand">{item.intentionDesc}</span>
                  <button
                    onClick={() => {
                      handleClick(item.uniqueKey);
                    }}
                  >
                    X
                  </button>
                </li>
              );
            })}
          </ul>
        </section>
      </main>
      <Footer />
    </div>
  );
}

export default App;
