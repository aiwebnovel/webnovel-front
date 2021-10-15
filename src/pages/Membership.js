import React, { useContext } from 'react';
import Header from "../components/Header.js";
import Footer from "../components/Footer.js";
import Price from "../components/Membership.js";
import { ResponsiveContext } from "grommet";

const Membership = () => {
  const size = useContext(ResponsiveContext);
  return (
    <div>
      <Header />
      <Price sizes={size}/>
      <Footer />
    </div>
  );
};

export default Membership;
