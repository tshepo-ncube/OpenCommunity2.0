"use client";
// import AdvancedCalendar from "../_Components/AdvancedCalendar";
// import "react-big-calendar/lib/css/react-big-calendar.css";
// import React, { useState, useEffect } from "react";
// import { Calendar, momentLocalizer } from "react-big-calendar";
// import moment from "moment";

// const localizer = momentLocalizer(moment);

// const events = [
//   {
//     start: moment("2024-09-18T10:00:00").toDate(),
//     end: moment("2024-09-18T11:00:00").toDate(),
//     title: "MRI Registration",
//   },
//   {
//     start: moment("2023-03-18T14:00:00").toDate(),
//     end: moment("2023-03-18T15:30:00").toDate(),
//     title: "ENT Appointment",
//   },
// ];
// export default function page() {
//   return (
//     <>
//       <h1>Hey thre </h1>
//       {/* <AdvancedCalendar /> */}
//       <div>
//         <Calendar
//           localizer={localizer}
//           events={events}
//           startAccessor="start"
//           endAccessor="end"
//           style={{ height: 500 }}
//         />
//       </div>
//     </>
//   );
// }

import React, { useState } from "react";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import { format, parse, startOfWeek, getDay } from "date-fns";
import enUS from "date-fns/locale/en-US";
import "react-big-calendar/lib/css/react-big-calendar.css";

const locales = {
  "en-US": enUS,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

const MyCalendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const events = [
    {
      title: "Meeting",
      start: new Date(),
      end: new Date(),
    },
  ];

  return (
    //           localizer={localizer}
    //           events={events}
    //           startAccessor="start"
    //           endAccessor="end"
    //           style={{ height: 500 }}
    //         />

    <div className="p-32">
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        date={currentDate}
        style={{ height: 500 }}
        onNavigate={(date) => setCurrentDate(date)}
        onView={(view) => console.log(view)}
      />
    </div>
  );
};

export default MyCalendar;
