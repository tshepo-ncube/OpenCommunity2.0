import React, { useState, useRef, useEffect } from "react";
import OpenAI from "openai";
import ChatCard from "../_Components/ChatCard";
import { ThreeDots } from "react-loader-spinner";
import axios from "axios";
import CommunityDB from "@/database/community/community";
import strings from "../Utils/strings.json";

const Chatbot = ({ setEventForm, setShowEventForm, communityID }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [threadID, setThreadID] = useState("");
  const [assistantID, setAssistantID] = useState("");
  const [runID, setRunID] = useState("");

  const [messages, setMessages] = useState(null);
  const [inputValue, setInputValue] = useState("");
  const messagesEndRef = useRef(null);
  const [newMessage, setNewMessage] = useState("");
  const [loader, setLoader] = useState(true);
  const [msgsLoading, setMsgsLoading] = useState(true);
  const [sentMessageProcessed, setSentMessageProcessed] = useState(true);
  const [communityData, setCommunityData] = useState(null);
  const divRef = useRef(null);
  const [currentGoal, setCurrentGoal] = useState({
    Descr: "I want to win",
    Due: "2024-05-31",
    Image: "",
    Reward: null,
    Title: "Soccer Community",
    assistantID: "asst_EiHgeiLbxcs1r1855lryoIe8",
    dateCreated: "March 25, 2024 at 5:28:52 PM UTC+2",
    runID: "run_GuV63F5sRM7OOAFTnZqhOtU3",
    threadID: "thread_Fs2VYok9YAiXZ1qHv5TpDeIZ",
    userID: "tshepo@gmail.com",
  });

  const [pause, setPause] = useState(true);
  const intervalRef = useRef(null); // To store the interval ID

  useEffect(() => {
    setCommunityData();
    CommunityDB.getCommunity(communityID, setCommunityData);
  }, []);

  useEffect(() => {
    console.log(communityData);
    createNewAssistant();
  }, [communityData]);

  const togglePause = () => {
    setPause((prevState) => !prevState); // Toggle paused state
  };

  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  const sendMessageHandler = async () => {
    console.log("sendMessageHandler");
    setLoading(true);
    sendMsgOpenAi();
    scrollToBottom();
  };

  const handleMessageSend = async () => {
    setMessages((prevMessages) => [
      ...prevMessages,
      { sender: "You", content: [{ text: { value: newMessage } }] },
      { sender: "AI", content: [] },
    ]);

    let instructions = `You are an assistant designed to help 
    recommend new events for the ${communityData.name}. Your primary task is to 
    recommend one event (ONLY JSON, NO EXPLANATION OR TEXT) .Provide the following details
     to ensure the event's success: Idea For Event, Optimal Timing,
     location suitability, start_date (TIMESTAMP SECONDS PLZ) and end_date (TIMESTAMP SECONDS PLZ). If you're recommending an event 
      please respond in a json format ONLY (no other text, only JSON)
       with fields name, description, idea_for_event, optimal_timing, 
       start_date,end_date  and location. No matter What, Respond with one event at a time. If you not recommending
        an event or just answering a question you can respond normally (less than 300 characters please) (NO JSON, JUST TEXT). First greet me, i am Holly Nowers, ask me about the kind of event I would like`;

    // const newMessageCopy = newMessage.slice();
    try {
      const res = await axios.post(
        //"http://localhost:8080/sendMessage",
        strings.server_endpoints.sendMessage,
        { newMessage, threadID, runID, assistantID, instructions },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      console.log("THIS IS A COMMMMMMIT: ", res.data.messages);
      setNewMessage("");

      console.log("Returned Messages: ", res.data.messages);
      //setMessages(res.data.messages);
      setMessages([...res.data.messages]); // Ensure this is a new array
      setNewMessage("");
      console.log("New Messages Refreshed");
    } catch (error) {
      console.log("Endpoint Called : ", strings.server_endpoints.sendMessage);
      console.log(error);
    }
  };

  const sendMoreReccMsg = async () => {
    setMessages((prevMessages) => [
      ...prevMessages,
      {
        sender: "You",
        content: [{ text: { value: "Recomment another event please" } }],
      },
      { sender: "AI", content: [] },
    ]);

    let instructions = `You are an assistant designed to help 
    recommend new events for the ${communityData.name}. Your primary task is to 
    recommend one event (ONLY JSON, NO EXPLANATION OR TEXT) .Provide the following details
     to ensure the event's success: Idea For Event, Optimal Timing,
     location suitability, start_date (TIMESTAMP SECONDS PLZ) and end_date (TIMESTAMP SECONDS PLZ). If you're recommending an event 
      please respond in a json format ONLY (no other text, only JSON)
       with fields name, description, idea_for_event, optimal_timing, 
       start_date,end_date  and location. No matter What, Respond with one event at a time. If you not recommending
        an event or just answering a question you can respond normally (less than 300 characters please) (NO JSON, JUST TEXT). First greet me, i am Holly Nowers, ask me about the kind of event I would like`;

    try {
      const res = await axios.post(
        strings.server_endpoints.sendMessage,
        // "http://localhost:8080/sendMessage",
        {
          newMessage: "another one please",
          threadID,
          runID,
          assistantID,
          instructions,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Returned Messages: ", res.data.messages);
      //setMessages(res.data.messages);
      setMessages([...res.data.messages]); // Ensure this is a new array
      setNewMessage("");
      console.log("New Messages Refreshed");
    } catch (error) {
      console.log(error);
    }
  };
  const sendMsgOpenAi = async () => {
    console.log("Sending message");
    setSentMessageProcessed(false);

    setNewMessage("");
    setSentMessageProcessed(true);
  };

  useEffect(() => {
    if (threadID && assistantID && runID) {
      fetchMessages();
    } else {
      console.log("threadid assistantid and runid not there...");
    }
  }, [threadID, assistantID, runID]);

  const waitForCompletion = async (threadId, runId) => {};

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  useEffect(() => {
    console.log("Messages have changed.");
    console.log(messages);
    scrollToBottom();
  }, [messages]);

  const calculateRows = (text) => {
    const newLines = (text.match(/\n/g) || []).length + 1;
    const rows = Math.min(5, newLines + 1); // Limit to 5 rows
    return rows;
  };

  useEffect(() => {
    if (messages) {
      setLoader(false);
    } else {
      setLoader(true);
    }
  }, [messages]);

  const checkStatusAndPrintMessages = async (threadId, runId) => {
    console.log("checkStatusAndPrintMessages() starting...");
    await waitForCompletion(threadId, runId);

    let messages;

    messages = await openai.beta.threads.messages.list(threadId);
    let msgList = messages.data;
    console.log(msgList);
    const updatedMsgList = msgList.map((msg) => {
      return {
        ...msg, // Copy existing fields
        sender: msg.role === "user" ? "You" : "AI", // Add "sender" field
      };
    });
    updatedMsgList.sort((a, b) => a.created_at - b.created_at);
    setMessages([...updatedMsgList]); // Ensure a new array is created
    // If you want the messages in reverse chronological order, just sort them as such.

    console.log("Checking the MSG List");
    if (updatedMsgList.length > 0) {
      console.log("Message List length is > 0 : ", updatedMsgList.length);
      const lastMessage = updatedMsgList[msgList.length - 1];

      // Add the "sender" field based on the "role"
      // Add the "sender" field based on the "role"

      if (lastMessage.role === "assistant" || true) {
        setMessages([...updatedMsgList]); // Ensure a new array is created
        console.log("setMessages is updated.");
        console.log("Last Message Belongs to Assistant : ", lastMessage);

        msgList.forEach((msg) => {
          const role = msg.role;
          const content =
            msg.content[0] && msg.content[0].text
              ? msg.content[0].text.value
              : "Content missing";
          console.log(
            `${role.charAt(0).toUpperCase() + role.slice(1)}: ${content}`
          );

          if (!msg.content[0]) {
            console.log(
              "******************************************************************"
            );
            console.log("A message is missing");
            console.log(
              "******************************************************************"
            );
            checkStatusAndPrintMessages(
              currentGoal.threadID,
              currentGoal.runID
            );
          }
          console.log(content.slice(7, -3));
          console.log("\n");
        });

        console.log("Sent message processed...");

        setMsgsLoading(false);
        return; // Exit the function as the assistant has responded
      }
    }

    setMsgsLoading(false); // Ensure loading is set to false to prevent infinite loading state
  };

  useEffect(() => {
    console.log("Chatbot just rendered");

    scrollToBottom();
  }, []);

  const fetchMessages = async () => {
    console.log("------------------------------------------");

    try {
      console.log("Fetching messages... ");
      const res = await axios.post(
        strings.server_endpoints.fetchMessages,
        // "http://localhost:8080/fetchMessages" ,
        { threadID, runID, assistantID },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Returned Messages: ", res.data.messages);
      //setMessages(res.data.messages);
      setMessages([...res.data.messages]); // Ensure this is a new array
      setNewMessage("");
      console.log("New Messages Refreshed");
    } catch (error) {
      console.log(error);
    }
  };
  const handleToggle = () => {
    setIsOpen(!isOpen);

    scrollToBottom();
  };

  const handleSend = (e) => {
    e.preventDefault();
    if (inputValue.trim()) {
      setMessages([
        ...messages,
        { id: messages.length + 1, sender: "You", content: inputValue },
      ]);
      setInputValue("");
    }
  };

  const chatbotMetaDataPresent = () => {
    var chatbotMetaData = localStorage.getItem("ChatbotMetaData");

    if (chatbotMetaData) {
      return true;
    }
    return false;
  };

  const communityChatbotMetaDataPresent = () => {
    var chatbotMetaData = localStorage.getItem("ChatbotMetaData");
    const chatbotMetaDataArrayObject = JSON.parse(chatbotMetaData);

    let foundObject = chatbotMetaDataArrayObject.find(
      (obj) => obj.communityID === communityID
    );
  };

  const localStorageChecker = async () => {
    // Ensure this runs only in the client (browser)
    if (typeof window === "undefined") return;

    try {
      if (
        localStorage.getItem("ThreadID") &&
        localStorage.getItem("AssistantID") &&
        localStorage.getItem("RunID")
      ) {
        // Retrieve IDs from localStorage
        const threadID = localStorage.getItem("ThreadID");
        const assistantID = localStorage.getItem("AssistantID");
        const runID = localStorage.getItem("RunID");

        // Check if run status is expired or not
        let runStatus = await openai.beta.threads.runs.retrieve(
          threadID,
          runID
        );

        if (runStatus.status === "expired") {
          createNewAssistant();
        } else {
          // Set thread, assistant, and run IDs
          setThreadID(threadID);
          setAssistantID(assistantID);
          setRunID(runID);

          console.log("local storage checker passed");

          // Perform further actions
          checkStatusAndPrintMessages(threadID, runID);
        }
      } else {
        // If any item is missing, create a new assistant
        createNewAssistant();
      }
    } catch (error) {
      console.error("Error in localStorageChecker:", error);
      // Handle errors like API failures, etc.
    }
  };

  const createNewAssistant = async () => {
    console.log("Creating New Assistant");

    if (communityData) {
      console.log(communityData.name);
      const communityName = communityData.name;
      try {
        const res = await axios.post(
          //"http://localhost:8080/createAssistant",
          strings.server_endpoints.createAssistant,
          { communityName },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        console.log("Returned Object: ", res.data.NewAssistant);
        setThreadID(res.data.NewAssistant.thread_id);
        setAssistantID(res.data.NewAssistant.assistant_id);
        setRunID(res.data.NewAssistant.id);
        console.log("New Messages Refreshed");
      } catch (error) {
        console.log(error);
      }
    }
  };

  const handleMore = () => {
    // setNewMessage("recommend another event.");
    // sendMessageHandler();

    // sendMoreReccMsg();
    sendMoreReccMsg();
  };

  function extractJsonFromText(inputString) {
    if (typeof inputString !== "string") {
      console.error("Input is not a string:", typeof inputString);
      return null;
    }

    const jsonMatch = inputString.match(/{[\s\S]*}/);

    if (jsonMatch) {
      try {
        const jsonObject = JSON.parse(jsonMatch[0]);
        console.log("JSON_OBJECT : ", jsonObject);
        return jsonObject;
      } catch (error) {
        console.error("Error parsing JSON:", error);
        return null;
      }
    } else {
      console.error("No JSON found in the input string.");
      return null;
    }
  }

  // Example usage:
  const inputText = `Sure! Here is a recommended event for the Soccer Community: 
  \`\`\`json 
  {
    "name": "Annual Soccer Festival",
    "description": "A fun-filled day of soccer games, contests, and activities for all ages and skill levels.",
    "predicted_attendance": 5000,
    "optimal_timing": "Weekend",
    "start_date": 1735564800,
    "end_date": 1735651200,
    "location": "City Soccer Complex"
  } 
  \`\`\``;

  return (
    <>
      {/* Button */}

      {loader ? (
        <> </>
      ) : (
        <>
          <button
            className="fixed bottom-4 right-4 inline-flex items-center justify-center text-sm font-medium disabled:pointer-events-none disabled:opacity-50 border rounded-full w-16 h-16 bg-openbox-green hover:bg-openbox-green m-0 cursor-pointer border-gray-200 bg-none p-0 normal-case leading-5 hover:text-gray-900"
            type="button"
            aria-haspopup="dialog"
            aria-expanded={isOpen}
            onClick={handleToggle}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="30"
              height="40"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-white block border-gray-200 align-middle"
            >
              <path
                d="m3 21 1.9-5.7a8.5 8.5 0 1 1 3.8 3.8z"
                className="border-gray-200"
              ></path>
            </svg>
          </button>

          {/* Chatbox */}
          {isOpen && (
            <div
              style={{
                zIndex: 150,
                boxShadow:
                  "0 0 #0000, 0 0 #0000, 0 1px 2px 0 rgb(0 0 0 / 0.05)",
              }}
              className=" mt-30 fixed bottom-[calc(4rem+1.5rem)] right-0 mr-4 bg-white p-6 rounded-lg border border-[#e5e7eb] w-[440px] h-[634px]"
            >
              {/* Heading */}
              <div
                style={{ zIndex: 99 }}
                className="bg-white fixed z-100 border-b-2 w-[240px] border-black p-2 flex flex-col space-y-1.5 pb-6"
              >
                <h2 className="font-semibold text-lg tracking-tight">
                  Chatbot
                </h2>
                <p className="text-sm text-[#6b7280] leading-3">
                  {communityData.name}
                </p>
              </div>

              {/* Chat Container */}
              <div
                // className="pr-4 h-[474px]"

                // className="mt-20 z-0 h-[474px]  overflow-y-auto  mb-400"
                // style={{
                //   minWidth: "100%",
                //   height: "200px",
                //   display: "table",
                //   overflowY: "scroll",
                // }}

                className="mt-20  z-0 overflow-y-auto flex-1 mb-4 pr-4"
                style={{ height: "78%" }}
              >
                {/* Chat Messages */}

                {messages.length == 0 ? (
                  <>
                    <p>No messages</p>
                  </>
                ) : (
                  <>
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className="flex gap-3 my-4 text-gray-600 text-sm flex-1"
                      >
                        <p className="leading-relaxed">
                          {/* {message.content[0].text.value} */}
                          {message.sender === "AI" ? (
                            <>
                              {message.content[0] &&
                              message.content[0].text.value ? (
                                <>
                                  {extractJsonFromText(
                                    message.content[0].text.value
                                  ) ? (
                                    <>
                                      <ChatCard
                                        name={
                                          extractJsonFromText(
                                            message.content[0].text.value
                                          ).name
                                        }
                                        description={
                                          extractJsonFromText(
                                            message.content[0].text.value
                                          ).description
                                        }
                                        date={
                                          extractJsonFromText(
                                            message.content[0].text.value
                                          ).date
                                        }
                                        start_date={
                                          extractJsonFromText(
                                            message.content[0].text.value
                                          ).start_date
                                        }
                                        end_date={
                                          extractJsonFromText(
                                            message.content[0].text.value
                                          ).end_date
                                        }
                                        location={
                                          extractJsonFromText(
                                            message.content[0].text.value
                                          ).location
                                        }
                                        handleMore={handleMore}
                                        setShowEventForm={setShowEventForm}
                                        setEventForm={setEventForm}
                                      />
                                    </>
                                  ) : (
                                    <>
                                      <p className=" bg-white  border w-90 p-2 rounded-lg mb-2 left-0">
                                        {message.content[0].text.value}
                                      </p>
                                    </>
                                  )}
                                </>
                              ) : (
                                <>
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
                                </>
                              )}
                            </>
                          ) : (
                            <>
                              <p className=" bg-openbox-green  border w-90 p-2 rounded-lg mb-2 left-0">
                                {message.content[0].text.value}
                              </p>
                            </>
                          )}
                        </p>
                      </div>
                    ))}
                  </>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Input box */}
              <div className=" pt-0  w-full p-4">
                <div className="flex items-center justify-center w-full space-x-2">
                  <input
                    className="flex h-10 w-full rounded-md border border-[#e5e7eb] px-3 py-2 text-sm placeholder-[#6b7280] focus:outline-none focus:ring-2 focus:ring-[#9ca3af] disabled:cursor-not-allowed disabled:opacity-50 text-[#030712] focus-visible:ring-offset-2"
                    placeholder="Type your message"
                    // value={inputValue}
                    // onChange={(e) => setInputValue(e.target.value)}

                    value={newMessage}
                    rows={calculateRows(newMessage)}
                    onChange={(e) => setNewMessage(e.target.value)}
                  />
                  <button
                    className="inline-flex items-center justify-center rounded-md text-sm font-medium text-[#f9fafb] disabled:pointer-events-none disabled:opacity-50 bg-openbox-green hover:bg-bg-openbox-green h-10 px-4 py-2"
                    onClick={handleMessageSend}
                    // onClick={() => {
                    //   setShowEventForm(true);
                    // }}
                  >
                    Send
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </>
  );
};

export default Chatbot;
