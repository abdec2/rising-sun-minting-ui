import HeaderComponent from "./Header";
import Stake from "./Stake";
import { useEffect } from "react";

const StakePage = ({ setError, setErrMsg }) => {

  useEffect(() => {
    document.documentElement.setAttribute('data-wf-page', '626bab4ccdd51fce15800bf6')
    window.Webflow && window.Webflow.destroy();
    window.Webflow && window.Webflow.ready();
    window.Webflow && window.Webflow.require("ix2").init();
    document.dispatchEvent(new Event("readystatechange"));
  })

  return (
    <>
      <HeaderComponent />
      <Stake />
    </>
  );
};

export default StakePage;
