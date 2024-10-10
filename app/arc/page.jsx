"use client";
import React, { useEffect, useState } from "react";

import { doc, getDoc, updateDoc } from "firebase/firestore";
import DB from "../../database/DB"; // Make sure to import your Firebase config

function CommunityScoreChecker() {
  const [communityID, setCommunityID] = useState("0xUi0rR83ka9F1pOg1to");

  const [isOpen, setIsOpen] = useState(false);

  const toggleModal = () => {
    setIsOpen(!isOpen);
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  // Function to check community score
  const checkCommunityScore = async (communityID) => {
    console.log("checkCommunityScore");

    try {
      const communityRef = doc(DB, "communities", communityID); // Reference to the community document

      console.log("did ref");

      // Get the community document
      const docSnapshot = await getDoc(communityRef);
      console.log("got snapshot");

      if (docSnapshot.exists()) {
        console.log("docs exists");
        const communityData = docSnapshot.data();
        const score = communityData.score || 0; // Default to 0 if score doesn't exist
        console.log(`Community ${communityID} has a score of: `, score);

        // Update lastCheck to current date after checking the score
        const today = new Date();
        await updateDoc(communityRef, { lastCheck: today });
        console.log("Community Score checked and lastCheck updated to:", today);
      } else {
        console.error("No such document for community:", communityID);
      }
    } catch (error) {
      console.error("Error fetching community score:", error);
    }
  };

  // Check if today is the first of the month
  const isFirstOfMonth = () => {
    const today = new Date();
    return today.getDate() === 1;
  };

  // Check if the score was already checked this month
  const shouldCheckScore = async (communityID) => {
    try {
      const communityRef = doc(DB, "communities", communityID);

      const docSnapshot = await getDoc(communityRef);

      if (docSnapshot.exists()) {
        const communityData = docSnapshot.data();
        const lastCheck = communityData.lastCheck
          ? new Date(communityData.lastCheck.seconds * 1000)
          : null;

        const today = new Date();
        const currentMonth = today.getMonth();
        const currentYear = today.getFullYear();

        // If lastCheck exists, check if it is in the current month and year
        if (
          lastCheck &&
          lastCheck.getMonth() === currentMonth &&
          lastCheck.getFullYear() === currentYear
        ) {
          console.log(
            "Score has already been checked for this month. Skipping..."
          );
          return false; // No need to check again
        }
        return true; // Need to check
      } else {
        console.error("Community document does not exist!");
        return false; // No document, no check
      }
    } catch (error) {
      console.error("Error checking lastCheck:", error);
      return false; // Error, don't check
    }
  };

  // useEffect to run the check only on the first of each month and only if it hasn't been checked
  useEffect(() => {
    const checkIfNeeded = async () => {
      if (!isFirstOfMonth()) {
        const shouldCheck = await shouldCheckScore(communityID);
        if (shouldCheck) {
          console.log("I should check");
          await checkCommunityScore(communityID); // Perform score check and update lastCheck
        } else {
          console.log("no need to check");
        }
      }
    };

    checkIfNeeded(); // Call the function to see if a check is needed
  }, [communityID]);

  return (
    <>
      <h1>hey there</h1>

      <>
        {/* Modal toggle button */}
        <button
          onClick={toggleModal}
          className="block text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          type="button"
        >
          Toggle modal
        </button>

        {/* Modal */}
        {isOpen && (
          <div
            id="default-modal"
            tabIndex="-1"
            aria-hidden="true"
            className="fixed inset-0 z-50 flex justify-center items-center w-full h-[calc(100%-1rem)] max-h-full overflow-y-auto overflow-x-hidden"
          >
            <div className="relative p-4 w-full max-w-2xl max-h-full">
              {/* Modal content */}
              <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
                {/* Modal header */}
                <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Community Notice
                  </h3>
                  <button
                    type="button"
                    onClick={closeModal}
                    className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                  >
                    <svg
                      className="w-3 h-3"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 14 14"
                    >
                      <path
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M1 1l6 6m0 0l6 6M7 7l6-6M7 7l-6 6"
                      />
                    </svg>
                    <span className="sr-only">Community Notice</span>
                  </button>
                </div>

                {/* Modal body */}
                <div className="p-4 md:p-5 space-y-4">
                  <p className="text-base leading-relaxed text-gray-500 dark:text-gray-400">
                    This community has been inactive for more than 28 days. All
                    users in the community will be notified about the
                    inactivity. If the inactivity continues, the community will
                    be archived to ensure proper management of active groups.
                  </p>
                  {/* <p className="text-base leading-relaxed text-gray-500 dark:text-gray-400">
                    The European Union’s General Data Protection Regulation
                    (G.D.P.R.) goes into effect on May 25 and is meant to ensure
                    a common set of data rights in the European Union. It
                    requires organizations to notify users as soon as possible
                    of high-risk data breaches that could personally affect
                    them.
                  </p> */}
                </div>

                {/* Modal footer */}
                <div className="flex items-center p-4 md:p-5 border-t border-gray-200 rounded-b dark:border-gray-600">
                  <button
                    onClick={closeModal}
                    className="text-white bg-openbox-green hover:bg-openbox-green focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                  >
                    Notify members
                  </button>
                  <button
                    onClick={closeModal}
                    className="py-2.5 px-5 ms-3 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
                  >
                    Decline
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </>
    </>
  ); // No UI component needed, this is just for checking
}

export default CommunityScoreChecker;
