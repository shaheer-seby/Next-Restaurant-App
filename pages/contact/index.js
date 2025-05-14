"use client"; 

import React from "react";
import Link from "next/link";
import PageHeader from "@/styles/header/title/PageHeader";
import Banner from "@/styles/banner/Banner";

const Contact = () => {
  return (
    <>
      <Banner title="Contact" subtitle="Contact Us" />

      <section className="contacts">
        <div className="container flexSB">
          <div className="left row">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3620.123456789012!2d74.3292363150263!3d31.5820450512346!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3919111111111111%3A0x2222222222222222!2sLahore%2C%20Punjab%2C%20Pakistan!5e0!3m2!1sen!2s!4v0000000000000!5m2!1sen!2s"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Lahore Location"
            />
          </div>

          <div className="right row">
            <h1>Get in touch</h1>
            <div className="items grid-3">
              <div className="box">
                <h4>ADDRESS:</h4>
                <p>Gulberg III, Lahore, Pakistan</p>
              </div>
              <div className="box">
                <h4>EMAIL:</h4>
                <p>info@bistronoir.com</p>
              </div>
              <div className="box">
                <h4>PHONE:</h4>
                <p>+92 42 1234 5678</p>
              </div>
            </div>

           

            <h3>Follow Us at instagram: FastFoods</h3>
            <div className="social">
              <Link href="#"><i className="fab fa-facebook-f icon facebook"></i></Link>
              <Link href="#"><i className="fab fa-instagram icon instagram"></i></Link>
              <Link href="#"><i className="fab fa-twitter icon twitter"></i></Link>
              <Link href="#"><i className="fab fa-youtube icon youtube"></i></Link>
              <Link href="#"><i className="fab fa-linkedin-in icon linkedin"></i></Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Contact;
