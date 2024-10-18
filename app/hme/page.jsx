import React from "react";

import Home from "../../_Components/Home";
import Navbar from "../../_Components/Navbar";
import ForgotPassword from "../../_Components/NewPassword";

const HomePage = () => {
  return (
    // <div className="grid grid-cols-1 md:grid-cols-2 gap-4"></div>
    // <Home/>

    <>
      {/* <HeaderComponent title={"Mindful"} /> */}
      <body>
        <div className="mx-auto  max-w">
          {/* {header} */}
          {/* {children} */}
          {/* <Navbar isHome={true} /> */}
          <br />
          <br />

          {/* {children} */}
          {/* <Home /> */}

          {/* {footer} */}

          <ForgotPassword />
        </div>
      </body>
    </>
  );
};

export default HomePage;
