import React from "react";
import LogoWithBegeBackground from './../public/images/logo-bege-background.png';
import "./Footer.css";

function Footer() {
  return (
    <div className="footer d-flex flex-column justify-content-center align-items-center">
      <img src={LogoWithBegeBackground} alt="" className="m-2 w-20 responsive-size"/>
      <span className="text-light m-2 text-center">
        © Copyright 2020 - Tabacaria Rossio. Todos os direitos reservados.
      </span>
    </div>
  );
}

export default Footer;
