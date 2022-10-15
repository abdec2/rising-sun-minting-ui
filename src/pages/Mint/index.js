import HeaderComponent from "./Header";
import Mint from "./Mint";
import { useEffect } from "react";

const StakePage = ({ setError, setErrMsg }) => {

  useEffect(() => {
    document.documentElement.setAttribute('data-wf-page', '626bab4ccdd51f548a800bf3')
    window.Webflow && window.Webflow.destroy();
    window.Webflow && window.Webflow.ready();
    window.Webflow && window.Webflow.require("ix2").init();
    document.dispatchEvent(new Event("readystatechange"));
  })

  return (
    <>
      <HeaderComponent />
      <Mint />
    </>
  );
};

export default StakePage;
