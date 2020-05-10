import React, { Component } from "react";
import { Link } from "react-router-dom";
import FacebookLogo from "./../public/images/logos/facebook-icon.png";
import "./Index.css";

import mainImage from "./../public/images/tabacaria-rossio-main-page.png";
import nameBrand from "./../public/images//tabacaria-rossio-letters-main.png";
import picture1 from "./../public/images/index/lighter.png";
import picture2 from "./../public/images/index/pen.png";
import picture3 from "./../public/images/index/shaver.png";
import picture4 from "./../public/images/index/swiss-knife.jpg";
import picture5 from "./../public/images/index/tabaco.png";
import picture6 from "./../public/images/index/watch.png";

export default class Index extends Component {
  componentDidMount() {
    var part1 = "geral";
    var part2 = Math.pow(2, 6);
    var part3 = String.fromCharCode(part2);
    var part4 = "tabacariarossio.pt";
    var part5 = part1 + String.fromCharCode(part2) + part4;
    document.getElementById("contact-email").innerHTML =
      "<a " +
      `class="text-light"` +
      "href=" +
      "mai" +
      "lto" +
      ":" +
      part5 +
      " class=email-link" +
      ">" +
      part1 +
      part3 +
      part4 +
      "</a>";
  }
  render() {
    return (
      <div
        className="d-flex flex-column flex-column-reverse justiy-content-center align-items-center"
        id="page-index"
      >
        <div id="contacts_form" className="background-color-dark">
          <h2 className="color-light mb-4">FALE CONNOSCO</h2>
          <div className="d-flex flex-row flex-wrap justify-content-around">
            <div>
              <div>
                <h3 className="color-bege">Endereço</h3>
                <p className="text-light">
                  Rua do Ouro, 295 Lisboa, CP 1100-062
                </p>
              </div>
              <div>
                <h3 className="color-bege">E-mail</h3>
                <p className="text-light" id="contact-email"></p>
              </div>
              <div>
                <h3 className="color-bege">Telefone</h3>
                <p className="text-light">(+351) 213 425 221</p>
              </div>
              <div>
                <a
                  href="https://www.facebook.com/tabacariarossio.lisboa/"
                  target="_blank"
                >
                  <img src={FacebookLogo} alt="Facebook" />
                </a>
              </div>
            </div>
            <div className="map-google">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1811.4693806689597!2d-9.140279527959942!3d38.712616031621195!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xd193478af954e31%3A0x9a501b7354c058e7!2sTabacaria%20Rossio%2C%20Lda!5e0!3m2!1spt-PT!2spt!4v1588774983962!5m2!1spt-PT!2spt"
                width="100%"
                height="300"
                frameborder="0"
                style={{ border: "0", borderRadius: "25px" }}
                allowfullscreen=""
                aria-hidden="false"
                tabindex="0"
              ></iframe>
            </div>
          </div>
        </div>

        <div className="m-5" id="index-pictures">
          <div className="d-flex flex-wrap flex-row justify-content-around align-items-center">
            <Link to={"/store"}>
              <div className="content">
                <div class="content-overlay"></div>
                <img
                  src={picture1}
                  alt=""
                  className="img-fluid content-image"
                />
                <div class="content-details fadeIn-top">
                  <h3>ISQUEIROS</h3>
                </div>
              </div>
            </Link>

            <Link to={"/store"}>
              <div className="content">
                <div class="content-overlay"></div>
                <img
                  src={picture2}
                  alt=""
                  className="img-fluid content-image"
                />
                <div class="content-details fadeIn-top">
                  <h3>CANETAS</h3>
                </div>
              </div>
            </Link>

            <Link to={"/store"}>
              <div className="content">
                <div class="content-overlay"></div>
                <img
                  src={picture3}
                  alt=""
                  className="img-fluid content-image"
                />
                <div class="content-details fadeIn-top">
                  <h3>MÁQUINAS DE BARBEAR</h3>
                </div>
              </div>
            </Link>

            <Link to={"/store"}>
              <div className="content">
                <div class="content-overlay"></div>
                <img
                  src={picture4}
                  alt=""
                  className="img-fluid content-image"
                />
                <div class="content-details fadeIn-top">
                  <h3>ACESSÓRIOS</h3>
                </div>
              </div>
            </Link>

              <div className="content">
                <div class="content-overlay"></div>
                <img
                  src={picture5}
                  alt=""
                  className="img-fluid content-image"
                />
                <div class="content-details fadeIn-top">
                  <h3>
                    TACABACO NACIONAL E INTERNACIONAL.
                    <span className="font-italic font-weight-light text-lowercase d-inline-block">
                      *Produtos de tabaco só estão disponíveis na nossa loja
                      física.
                    </span>
                  </h3>
                </div>
              </div>
           
            <Link to={"/store"}>
            <div className="content">
              <div class="content-overlay"></div>
              <img src={picture6} alt="" className="img-fluid content-image" />
              <div class="content-details fadeIn-top">
                <h3>RELÓGIOS</h3>
              </div>
            </div>
            </Link>
          </div>
        </div>

        <div>
          <img
            src={mainImage}
            alt="Tabacaria Rossio entrada"
            className="picture-road"
          />
        </div>

        <div className="div-index-logo">
          <img
            src={nameBrand}
            alt="Tabacaria Rossio"
            className="mt-50 index-logo"
          />
        </div>
      </div>
    );
  }
}
