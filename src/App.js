import "././styles/App.css";
import firebase from "./firebase.js";
import React from "react";
import Header from "./Components/Header.js";
import Input from "./Components/Input";
// import Intention from './Components/Intention'
import Footer from "./Components/Footer";
import { useEffect, useState } from "react";

function App() {
  const [intentionArray, setIntentionArray] = useState([]);
  const [handleDate, setHandleDate] = useState("");
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
  };

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
      setHandleDate("");
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
        <Input
          handleSubmit={handleSubmit}
          handleDate={handleDate}
          handleChange={handleChange}
          setHandleDate={setHandleDate}
          textInput={textInput}
          textInputErr={textInputErr}
          textExpand={textExpand}
          handleTextExpand={handleTextExpand}
        />
        <section className="intentionLogs">
          <ul className="intentionLogList">
            {intentionArray.map((item) => {
              return (
                <li key={item.uniqueKey}>
                  <span className="date">{item.todaysDate} </span>
                  <span className="intention">{item.intention}</span>
                  <span className="textExpandEntry">{item.intentionDesc}</span>
                  <button
                    onClick={() => {
                      handleClick(item.uniqueKey);
                    }}
                  >
                    X
                  </button>
                </li>
                // Note: Working on successfully executing an Intention Component instead of an li element:
                // <Intention key={index} item={item} handleClick={handleClick}/>
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
