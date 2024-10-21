"use client";
import React, { useState, useEffect, useRef } from "react";
import { ThreeDots } from "react-loader-spinner";
import Skeleton from "@mui/material/Skeleton";
import Grid from "@mui/material/Grid";
import { Fab, Button } from "@mui/material";
import Box from "@mui/material/Box";
import { MdDelete } from "react-icons/md";
import { useTheme, ThemeProvider, createTheme } from "@mui/material/styles";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import { IoIosArrowBack } from "react-icons/io";
import ButtonGroup from "@mui/material/ButtonGroup";
import AddIcon from "@mui/icons-material/Add";
import Link from "next/link";
import CircularProgress, {
  circularProgressClasses,
} from "@mui/material/CircularProgress";
import { styled } from "@mui/material/styles";
import Stack from "@mui/material/Stack";
import { AiOutlineMenu, AiOutlineClose } from "react-icons/ai";
import { IoChevronBack } from "react-icons/io5";
import { IoMdArrowRoundBack } from "react-icons/io";
import SendIcon from "@mui/icons-material/Send";
import { IconButton } from "@mui/material";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import ThumbDownIcon from "@mui/icons-material/ThumbDown";
import LinearProgress, {
  linearProgressClasses,
} from "@mui/material/LinearProgress";
import OpenAI from "openai";
import ReactMarkdown from "react-markdown";
import { initializeApp } from "firebase/app";
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  onAuthStateChanged,
  signOut,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import ChatCard from "../_Components/ChatCard";

import {
  getFirestore,
  collection,
  addDoc,
  doc,
  getDoc,
  query,
  where,
  setDoc,
  updateDoc,
  getDocs,
  runTransaction,
} from "firebase/firestore";

//import { firebase } from "firebase";
// import { firebaseui } from "firebaseui";
//var firebase = require("firebase");
//var firebaseui = require("firebaseui");
// TODO: Replace the following with your app's Firebase project configuration
const firebaseConfig = {
  apiKey: "AIzaSyC-TWCp-jNGYuzdjZbmD4tn5KsOCjgRCWM",
  authDomain: "mindfulmanifesters-bb23e.firebaseapp.com",
  projectId: "mindfulmanifesters-bb23e",
  storageBucket: "mindfulmanifesters-bb23e.appspot.com",
  messagingSenderId: "816933119912",
  appId: "1:816933119912:web:a009d7a035bf3c491c1f9d",
  measurementId: "G-1G8NESR5QL",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const openai = new OpenAI({
  apiKey:
    "sk-MOIB1y6ncCA3Rtgq5E72eRWLMrDNiPwnNJuMhD2tb5T3BlbkFJ3DLk-OipaqJRNDln96Z_3kXrnV1Hbwr-vx3_AUcYAA",
  dangerouslyAllowBrowser: true,
});

const BorderLinearProgress = styled(LinearProgress)(({ theme }) => ({
  height: 10,
  borderRadius: 5,
  [`&.${linearProgressClasses.colorPrimary}`]: {
    backgroundColor:
      theme.palette.grey[theme.palette.mode === "light" ? 200 : 800],
  },
  [`& .${linearProgressClasses.bar}`]: {
    borderRadius: 5,
    backgroundColor: theme.palette.mode === "light" ? "#1a90ff" : "#308fe8",
  },
}));

const ColorModeContext = React.createContext({ toggleColorMode: () => {} });
function formatDateToWords(dateString) {
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const [year, month, day] = dateString.split("-").map(Number);

  const monthName = months[month - 1];

  return `${monthName} ${day}, ${year}`;
}
function EventAssistant() {
  const theme = useTheme();
  const colorMode = React.useContext(ColorModeContext);
  const [entry, setEntry] = useState("");
  const [insights, setInsights] = useState(true);
  const [loading, setLoading] = useState(false);
  const [placeholderText, setPlaceholderText] = useState(
    "Lately, I feel like I'm drifting apart from the people I care about most, and it's leaving me feeling lonely and disconnected..."
  );
  const [threadID, setThreadID] = useState(null);
  const [runID, setRunID] = useState(null);
  const [assistantID, setAssistantID] = useState(null);
  const placeholderOptions = [
    "I'm feeling overwhelmed by the constant pressure to perform at work, and it's draining me both mentally and emotionally...",
    "The thought of my upcoming exam is like a dark cloud looming over me, causing my stomach to churn with anxiety every time I think about it...",
    "I can't seem to shake this feeling of dissatisfaction with my appearance, and it's taking a toll on my self-confidence and overall well-being...",
    "My relationships feel strained and distant lately, and I can't help but wonder if I'm failing as a friend/partner/family member...",
    "Every day feels like a battle to keep my head above water, and I'm exhausted from trying to juggle all of life's demands...",
    "The future feels uncertain and daunting, and I'm struggling to find a sense of direction or purpose in my life...",
    "No matter how hard I try to stay positive, negative thoughts and self-doubt keep creeping in, making it difficult to see a way out of this rut...",
  ];
  const [nav, setNav] = useState(false);
  const [value, setValue] = React.useState(2);
  const [newMessage, setNewMessage] = useState("");
  const [textColor, setTextColor] = useState("black");

  const [sentMessageProcessed, setSentMessageProcessed] = useState(true);
  // const [messages, setMessages] = useState([
  //   {
  //     message:
  //       " I feel good about myself, I am fostering a reslient mindset, I am trying to be more reslient",
  //     role: "user",
  //   },
  //   {
  //     message:
  //       "  Fostering a resilient mindset, embracing positivity, and prioritizing mental well-being for a healthier, happier, and more fulfilling life journey. How are you going to make sure you remain reslient?",
  //     role: "assistant",
  //   },
  // ]);

  const [messages, setMessages] = useState([]);
  const [newGoal, setNewGoal] = useState(false);
  const [msgsLoading, setMsgsLoading] = useState(true);
  const [goals, setGoals] = useState([
    {
      Descr: "I want to win",
      Due: "2024-05-31",
      Image: "",
      Reward: null,
      Title: "Soccer Community",
      assistantID: "asst_yE2NzcY2u5xuvJSTkba4SyUw",
      dateCreated: "March 25, 2024 at 5:28:52 PM UTC+2",
      runID: "run_ebLm1gUNUoSPOyo9MHjUJIfS",
      threadID: "thread_2UkmxiSmXpuqPtSnEbCzN2Jj",
      userID: "tshepo@gmail.com",
    },
  ]);

  const divRef = useRef(null);
  const sendBtnRef = useRef(null);
  const [currentGoal, setCurrentGoal] = useState({
    Descr: "I want to win",
    Due: "2024-05-31",
    Image: "",
    Reward: null,
    Title: "Soccer Community",
    assistantID: "asst_yE2NzcY2u5xuvJSTkba4SyUw",
    dateCreated: "March 25, 2024 at 5:28:52 PM UTC+2",
    runID: "run_ebLm1gUNUoSPOyo9MHjUJIfS",
    threadID: "thread_2UkmxiSmXpuqPtSnEbCzN2Jj",
    userID: "tshepo@gmail.com",
  });

  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  const waitForCompletion = async (threadId, runId) => {
    let runStatus = await openai.beta.threads.runs.retrieve(threadId, runId);
    console.log(`current run status - ${runStatus.status}`);
    while (runStatus.status !== "completed") {
      await delay(1500); // Wait for 1.5 seconds before checking again
      runStatus = await openai.beta.threads.runs.retrieve(threadId, runId);
    }
    console.log("run status - completed");
    return runStatus;
  };

  const checkStatusAndPrintMessages = async (threadId, runId) => {
    await waitForCompletion(threadId, runId);
    console.log("*******************run  - complete**************************");

    let messages;
    let attempts = 0;
    const maxAttempts = 5; // Set maximum attempts to retry fetching messages

    do {
      messages = await openai.beta.threads.messages.list(threadId);
      let msgList = messages.data;
      setMessages([...msgList]); // Ensure a new array is created
      // If you want the messages in reverse chronological order, just sort them as such.
      msgList.sort((a, b) => a.created_at - b.created_at);
      console.log("Checking the MSG List");
      if (msgList.length > 0) {
        console.log("Message List length is > 0 : ", msgList.length);
        const lastMessage = msgList[msgList.length - 1];

        if (lastMessage.role === "assistant" || true) {
          setMessages([...msgList]); // Ensure a new array is created
          console.log("setMessages is updated.");

          msgList.forEach((msg) => {
            const role = msg.role;
            const content =
              msg.content[0] && msg.content[0].text
                ? msg.content[0].text.value
                : "Content missing";
            console.log(
              `${role.charAt(0).toUpperCase() + role.slice(1)}: ${content}`
            );
            console.log(content.slice(7, -3));
            console.log("\n");
          });

          console.log("Sent message processed...");
          setSentMessageProcessed(true);
          setMsgsLoading(false);
          return; // Exit the function as the assistant has responded
        }
      }

      console.log("Assistant's response not found, retrying...");
      await delay(1500); // Wait for 1.5 seconds before retrying
      attempts++;
    } while (attempts < maxAttempts);

    console.error(
      "Failed to retrieve assistant's response after multiple attempts."
    );
    setMsgsLoading(false); // Ensure loading is set to false to prevent infinite loading state
  };

  // Step 2: Scroll function
  // const scrollToBottom = () => {
  //   divRef.current.scrollTop = divRef.current.scrollHeight;
  // };

  // const scrollToButton = () => {
  //   sendBtnRef.current.scrollTop = divRef.current.scrollHeight;
  // };

  // Calculate the number of rows based on the length of the text
  const calculateRows = (text) => {
    const newLines = (text.match(/\n/g) || []).length + 1;
    const rows = Math.min(5, newLines + 1); // Limit to 5 rows
    return rows;
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setPlaceholderText(
        placeholderOptions[
          Math.floor(Math.random() * placeholderOptions.length)
        ]
      );
    }, 3500);

    return () => clearInterval(interval);
  }, []);

  // useEffect(() => {
  //   //scrollToBottom();
  //   // Example usage
  //   // checkStatusAndPrintMessages(
  //   //   "thread_NWXJ1BmVcioMrytGGihRBAvf",
  //   //   "run_oaWP3GLQzV1lEtLpGtnAYUiE"
  //   // );
  //   getGoalsFirebase();
  //   // checkStatusAndPrintMessages(
  //   //   "thread_crJHTa7QROz47WVmcj94DiUf",
  //   //   "run_gbSGAWlXgKHi2l80yWASBuKe"
  //   // );
  //   checkStatusAndPrintMessages(currentGoal.threadID, currentGoal.runID);
  // }, [messages]);

  // useEffect(() => {
  //   //scrollToBottom();
  //   // Example usage
  //   // checkStatusAndPrintMessages(
  //   //   "thread_NWXJ1BmVcioMrytGGihRBAvf",
  //   //   "run_oaWP3GLQzV1lEtLpGtnAYUiE"
  //   // );
  //   //getGoalsFirebase();
  //   // checkStatusAndPrintMessages(
  //   //   "thread_crJHTa7QROz47WVmcj94DiUf",
  //   //   "run_gbSGAWlXgKHi2l80yWASBuKe"
  //   // );
  //   console.log("Current Goal Changed");
  //   checkStatusAndPrintMessages(currentGoal.threadID, currentGoal.runID);
  // }, [currentGoal]);

  useEffect(() => {
    console.log("Current Goal Changed");
    checkStatusAndPrintMessages(currentGoal.threadID, currentGoal.runID);
  }, [currentGoal]);

  useEffect(() => {
    scrollToBottom();
    // Example usage
    // checkStatusAndPrintMessages(
    //   "thread_NWXJ1BmVcioMrytGGihRBAvf",
    //   "run_oaWP3GLQzV1lEtLpGtnAYUiE"
    // );
    //getGoalsFirebase();
    // Wait for 10 seconds
    checkStatusAndPrintMessages(currentGoal.threadID, currentGoal.runID);
    // checkStatusAndPrintMessages(
    //   "thread_crJHTa7QROz47WVmcj94DiUf",
    //   "run_gbSGAWlXgKHi2l80yWASBuKe"
    // );
  }, []);

  // useEffect(() => {
  //   const cachedData = sessionStorage.getItem("messages");
  //   if (false) {
  //     setMessages(JSON.parse(cachedData));
  //   } else {
  //     // fetchData().then((apiData) => {
  //     //   sessionStorage.setItem("myData", JSON.stringify(apiData));
  //     //   setData(apiData);
  //     // });
  //     // checkStatusAndPrintMessages(
  //     //   "thread_NWXJ1BmVcioMrytGGihRBAvf",
  //     //   "run_oaWP3GLQzV1lEtLpGtnAYUiE"
  //     // );
  //     // checkStatusAndPrintMessages(
  //     //   "thread_crJHTa7QROz47WVmcj94DiUf",
  //     //   "run_gbSGAWlXgKHi2l80yWASBuKe"
  //     // );
  //     checkStatusAndPrintMessages(currentGoal.threadID, currentGoal.runID);
  //   }
  // }, []);

  const handleInputChange = (event) => {
    setEntry(event.target.value);
  };

  const handleSave = () => {
    console.log("Journal Entry:", entry);
    // You can add more logic here to save the entry to a database or perform other actions
  };

  const handleInsights = () => {
    console.log("Journal Entry:", entry);
    setInsights(false);
  };

  const handleReflect = () => {
    console.log("Journal Entry: .", entry);
    setInsights(true);
  };
  const sendMsgOpenAi = async () => {
    setSentMessageProcessed(false);
    const message = await openai.beta.threads.messages.create(
      currentGoal.threadID,
      {
        role: "user",
        content: newMessage,
      }
    );

    const run = await openai.beta.threads.runs.create(currentGoal.threadID, {
      // assistant_id: "asst_TuuWO4MxdsPJPgmdgLkXyeUN",asst_L1rmvjtYlVbgGWk89a53CmP3
      assistant_id: currentGoal.assistantID,
      instructions: `You are an assistant designed to help recommend new events specifically for the Soccer Community. Your primary task is to provide tailored event suggestions based on current trends, community interests, and user behavior data. With each event recommendation, you should also provide the following details to ensure the event's success: Predicted Attendance, Optimal Timing, and location suitability`,
    });
    console.log(`run id : ${run.id}`);
    console.log(run);

    checkStatusAndPrintMessages(currentGoal.threadID, currentGoal.runID);

    setNewMessage("");
  };
  const sendMessageHandler = async () => {
    setLoading(true);
    sendMsgOpenAi();
    scrollToBottom();
  };

  const messagesEndRef = useRef(null);

  // Function to scroll to the bottom
  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  // useEffect to scroll to the bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleNav = () => {
    setNav(!nav);
  };

  const handleNewGoal = () => {
    setNewGoal(!newGoal);
  };

  const changeChat = (goalData) => {
    const title = goalData.Title;

    const foundObject = goals.find((obj) => obj.Title === title);

    if (foundObject) {
      console.log("Found object:", foundObject);
      setCurrentGoal(foundObject);
      console.log("Current object:", currentGoal);
    } else {
      console.log("Object with Title 'hey' not found.");
    }
  };
  return (
    <div style={{ marginLeft: 0, marginRight: 0 }}>
      <div className="w-full mx-auto mt-2 p-2 ">
        <div className=" z-100 fixed top-0 left-0 w-full bg-white p-4">
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            {/* Mobile Button */}

            <div onClick={handleNav}>
              {nav ? (
                // <AiOutlineClose
                //   size={20}
                //   style={{ color: `${textColor}`, zIndex: 9999 }}
                // />

                <IoMdArrowRoundBack
                  size={20}
                  style={{ color: `${textColor}`, zIndex: 9999 }}
                />
              ) : (
                // <AiOutlineMenu
                //   size={20}
                //   style={{ color: `${textColor}`, zIndex: 1 }}
                // />

                <IoMdArrowRoundBack
                  size={20}
                  style={{ color: `${textColor}`, zIndex: 1 }}
                />
              )}
            </div>

            {/* Title */}
            <div style={{ textAlign: "center", flex: 1 }}>
              <h2 className="text-xl font-bold mt-2">{currentGoal.Title}</h2>
            </div>

            {/* Placeholder for alignment */}
            <div style={{ width: 20, height: 20, opacity: 0 }}>
              {" "}
              {/* Invisible placeholder to balance the layout */}{" "}
            </div>
          </div>

          {nav ? (
            <>
              <div
                className={
                  "overflow-y-auto z-10 absolute top-0 left-0 bottom-0 flex justify-center lg:w-[40%] sm:w-full md:w-[60%] h-screen bg-gray-100 text-center ease-in duration-300 p-4"
                }
              >
                <div
                  onClick={handleNav}
                  className="absolute top-0 right-0 p-6"
                  style={{ zIndex: 9999 }}
                >
                  {nav ? (
                    <>
                      {/* <AiOutlineClose size={20} style={{ color: "black" }} /> */}

                      <IoMdArrowRoundBack
                        size={20}
                        style={{ color: "black" }}
                      />
                    </>
                  ) : (
                    <>
                      {/* <AiOutlineMenu size={20} style={{ color: "black" }} /> */}

                      <IoMdArrowRoundBack
                        size={20}
                        style={{ color: "black" }}
                      />
                    </>
                  )}
                </div>
              </div>
            </>
          ) : (
            <></>
          )}

          <hr style={{ marginTop: 8 }} />
        </div>

        {/* <hr style={{ marginTop: 8 }} /> */}
        <div
          // className="flex flex-col   h-screen overflow-y-auto mt-2 mb-400"
          className="flex flex-col mt-16 mb-6"
          ref={divRef}
        >
          {msgsLoading ? (
            <>
              <Skeleton
                variant="rounded"
                style={{ marginBottom: 5 }}
                width={"100%"}
                height={50}
              />
              <Skeleton
                variant="rounded"
                style={{ marginBottom: 5 }}
                width={"100%"}
                height={50}
              />
              <Skeleton
                variant="rounded"
                style={{ marginBottom: 5 }}
                width={"100%"}
                height={50}
              />
              <Skeleton
                variant="rounded"
                style={{ marginBottom: 5 }}
                width={"100%"}
                height={50}
              />
            </>
          ) : (
            <div className="ml-12 mr-12 ">
              {messages.length === 0 ? (
                <>
                  <div className="bg-white p-2">
                    {/* message from the AI*/}
                    <div className="bg-white border w-90 p-2 rounded-lg">
                      <p className="text-black" style={{ userSelect: "none" }}>
                        please type a message...
                      </p>
                    </div>
                  </div>
                </>
              ) : (
                <div className="bg-white bottom-0 mb-10">
                  {messages.map((msg) =>
                    msg.role === "user" ? (
                      <>
                        <div className="bg-white p-2 left-0 ml-80">
                          {/* message from the user*/}
                          <div className=" bg-openbox-green  border w-90 p-2 rounded-lg mb-2 left-0">
                            <p
                              className="text-white"
                              style={{ userSelect: "none" }}
                            >
                              {msg.content[0] && msg.content[0].text
                                ? msg.content[0].text.value
                                : "Content missing"}
                            </p>
                          </div>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="bg-white p-2 right-0 mr-80">
                          {/* message from the AI*/}
                          {/* <div className="bg-white border w-90 p-2 rounded-lg right-0"> */}
                          {/* <div className="bg-white w-90 p-2 rounded-lg right-0">
                            {msg.content[0] && sentMessageProcessed ? (
                              <>
                                <ChatCard
                                  name={
                                    JSON.parse(
                                      msg.content[0].text.value.slice(7, -3)
                                    ).name
                                  }
                                  description={
                                    JSON.parse(
                                      msg.content[0].text.value.slice(7, -3)
                                    ).description
                                  }
                                />
                              </>
                            ) : (
                              // <p>{JSON.parse(msg.content[0].text.value)}</p>
                              <ThreeDots
                                visible={true}
                                height="20"
                                width="40"
                                color="#bcd727"
                                radius="9"
                                ariaLabel="three-dots-loading"
                                wrapperStyle={{}}
                                wrapperClass=""
                              />
                            )}
                          </div> */}

                          <div className="bg-white w-90 p-2 rounded-lg right-0">
                            {msg.content[0] && sentMessageProcessed ? (
                              (() => {
                                try {
                                  const parsedContent = JSON.parse(
                                    msg.content[0].text.value.slice(7, -3)
                                  );
                                  return (
                                    <ChatCard
                                      name={parsedContent.name}
                                      description={parsedContent.description}
                                      date={parsedContent.date}
                                    />
                                  );
                                } catch (error) {
                                  // If JSON parsing fails, render the content as a plain string
                                  return (
                                    <p className=" bg-white  border w-90 p-2 rounded-lg mb-2 left-0">
                                      {msg.content[0].text.value}
                                    </p>
                                  );
                                }
                              })()
                            ) : (
                              <ThreeDots
                                visible={true}
                                height="20"
                                width="40"
                                color="#bcd727"
                                radius="9"
                                ariaLabel="three-dots-loading"
                                wrapperStyle={{}}
                                wrapperClass=""
                              />
                            )}
                          </div>
                        </div>
                      </>
                    )
                  )}

                  <div ref={messagesEndRef} />
                </div>
              )}
            </div>
          )}

          {/* <div className="mt-auto"></div> */}
        </div>
        <div
          className="bg-white-200 w-full p-2 pt-2 rounded-lg "
          id="reflectSection"
        >
          {loading ? (
            <>
              <Box sx={{ width: "100%", marginBottom: 2 }}>
                <LinearProgress />
              </Box>
            </>
          ) : (
            <></>
          )}

          <center>
            <div className="bg-white px-4 py-2 fixed w-full bottom-5">
              <div className="flex items-center">
                <input
                  className="w-full border rounded-full py-2 px-4 mr-2 resize-none"
                  type="text"
                  placeholder="What kind of events do you want?"
                  // placeholder={placeholderText}
                  value={newMessage}
                  rows={calculateRows(newMessage)}
                  onChange={(e) => setNewMessage(e.target.value)}
                ></input>
                <button
                  onClick={sendMessageHandler}
                  className="bg-openbox-green hover:bg-green-700 text-white font-medium py-2 px-4 rounded-full"
                >
                  <SendIcon className="ml-2 mr-2 text-white" />
                </button>
              </div>
            </div>
          </center>
        </div>
      </div>
    </div>
  );
}

export default EventAssistant;
