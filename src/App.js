import './App.css';
import firebase from './firebase.js';
import React from "react";
import Header from './Components/Header.js';
// import IntentionForm from './Components/IntentionForm.js';
// import IntentionInput from "./Components/IntentionInput.js";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Footer from './Components/Footer';
import { useEffect, useState } from 'react';

function App() {
  // SCOPE --
  // An app which holds daily intentions
  // List of intentions comes from user input
  // Store intentions in the parent (App) component
    // pass down to the child (userIntention) component
    // Initialize a state to keep track of the intentions as they are added or removed
  // Create a userIntention component which will display each individual intention
  // each intention will have a delete button which removes it from the list

  // PARTS --
  // *** App Component ***
  // Two local methods (handleChange) to handle the onChange events to update states with user input:
  // - userIntention
  // - dateInput

  // *** Result Component ***
  // Handles user intention input

  // *** Date Component ***
  // Handles user date input

  // Render the application
  // - header component
  // - a form for user input
  // - a date picker that is connected to input upon submit (to log in the db too)
  // - one HTML/CSS section on the page which is activated upon click / hover
  // - use imported Result and Date components
  // - footer component

  // setting states
  const [ intentionArray, setIntentionArray ] = useState([]);

  const [ handleDate, setHandleDate ] = useState(null);

  const [ textInput, setTextInput ] = useState('');

  const [ textInputErr, setTextInputErr ] = useState({});

  const dbRef = firebase.database().ref();

  // once component is rendered, add input to database
  useEffect(() => {

    dbRef.on('value', (data) => {
      // console.log(data.val());

      const intentionData = data.val();
      const intentionsInState = [];

      for (let intentionKey in intentionData) {
        intentionsInState.push({
          uniqueKey: intentionKey,
          todaysDate: intentionData[intentionKey].date,
          intention: intentionData[intentionKey].text,
        });
      }
      setIntentionArray(intentionsInState);
    });

  }, []);

  // handle input change
  const handleChange = (event) => {
    setTextInput(event.target.value);
  }

  // const handleDate = (event) => {
  //   setHandleDate(event.target.value);
  // }

  // validate input and push data into database
  const handleSubmit = (event) => {
    event.preventDefault();
    const isValid = formValidation();

    // In order to put the date into the db too, we parsed the date from the handleDate variable:
    const date = handleDate.toDateString();

    // we put the data into an object, and passed in the date and text properties:
    const dataObject = {
    date: date,
    text: textInput,
    }

    // we push in the dataObject to the db:
    if(isValid){
      dbRef.push(dataObject);
      setTextInput("");
    }
  }

  const formValidation = () => {
    const textInputErr = {};
    let isValid = true;
    if(textInput.trim().length < 4){
      textInputErr.textInputShort = 'Please type a full word to continue.';
      isValid = false;
    }
    if (textInput.trim().length > 14){
      textInputErr.textInputLong = 'Please only type one to two words.';
      isValid = false;
    }
    setTextInputErr(textInputErr);
    return isValid;
  }

  const handleClick = (itemUniqueId) => {
    dbRef.child(itemUniqueId).remove();
  }

  return (
    <div className="wrapper">
      <Header />

      <main>
        <DatePicker selected={handleDate} onChange={date => setHandleDate(date)} dateFormat='MM/dd/yyyy' minDate={new Date()} placeholderText={`Choose date`} required/>
        <form action="" onSubmit={handleSubmit}>
          <label htmlFor="intentionInput">
            What one word, or feeling, would you like to move through this day
            with?
          </label>
          <input
            type="text"
            id="intentionInput"
            placeholder="Type here"
            onChange={handleChange}
            value={textInput}
          />
          {Object.keys(textInputErr).map((key) => {
            return <div style={{ color: "red" }}>{textInputErr[key]}</div>;
          })}
          <button>Log Entry</button>
        </form>

        <ul className="intentionLog">
          {intentionArray.map((item) => {
            return (
              <li key={item.uniqueKey}>
                {/* we pass in the date value to also show on the page */}
                <span>{item.todaysDate} </span>
                <span>{item.intention}</span>
                <button
                  onClick={() => {
                    handleClick(item.uniqueKey);
                    // handleDate(date);
                  }}
                >
                  Delete
                </button>
              </li>
            );
          })}
        </ul>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default App;
