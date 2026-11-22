"use client";

import React from "react";

import { StaticImageData } from "next/image";
import Link from "next/link";

import NavBar from "../components/NavBar";
import Footer from "../components/footer";
import Accordion from "../components/accordion";

import Blog2 from "../../assets/Blog2.png";
import Appointment from "@/assets/Appointment.png";

interface LayoutProps {
  headingText: string;
  backgroundImage: StaticImageData;
  faqItems: { title: string, body: React.ReactNode }[]
}

const Layout = ({ backgroundImage, headingText, faqItems }: LayoutProps) => {
  const [currentFAQ, setCurrentFAQ] = React.useState<number>(0);

  return (
    <div className="relative">
      <div className="flex flex-col bg-cover justify-between bg-center text-white pt-2 pb-6 h-96 md:pb-0 px-2 md:px-16 gap-4 md:gap-2" style={{
        height: "65vh",
        background: `url(${backgroundImage.src})`,
        backgroundRepeat: "no-repeat",
        backgroundPosition: "100% 0px",

      }}>
        <NavBar />
        <div className="flex flex-col h-full pt-12 md:w-1/2 gap-1">
          <p className="text-xl text-primary font-bold">We are experts at</p>
          <p className="text-4xl xl:text-5xl font-extrabold leading-tight">{headingText}</p>
        </div>
      </div>

      <div className="absolute w-full" style={{
        top: "50vh"
      }}>
        <div className="flex flex-col gap-8">

          <div className="flex flex-col rounded-lg bg-white gap-4 mx-2 md:mx-16 p-4">
            {faqItems.map((item, index) => (
              <Accordion
                open={currentFAQ == index}
                key={index}
                body={item.body}
                title={item.title}
                setOpen={() => setCurrentFAQ(index)}
              />
            ))}
          </div>

          <div id="footer">
            <BookAppointment />
            <Footer />
          </div>
        </div>
      </div>
    </div>
  );
};

interface PostProps {
  title: string;
  description: string;
  onClick: () => void;
}

const BookAppointment = () => {
  return (
    <div className="flex flex-col gap-7 items-center justify-center" style={{
      height: "27rem",
      background: `url(${Appointment.src}) no-repeat center center`,
    }}>
      <h4 className="text-4xl text-center text-white font-extrabold">Book an Appointment With Us Today!</h4>
      <Link href="/book-appointment" className="bg-white px-6 py-3 rounded-md">Book an Appointment</Link>
    </div>
  );
};
export default Layout;



