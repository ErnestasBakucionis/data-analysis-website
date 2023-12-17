import React from "react";
import ContactInfo from "@/components/sections/contactPage/ContactInfo";
import VerticalLine from "@/components/sections/contactPage/VerticalLine";
import ContactForm from "@/components/sections/contactPage/ContactForm";

const ContactPage: React.FC = () => {
  return (
    <div className="container mx-auto px-6 py-20">
      <div className="container mx-auto px-6 py-12 flex flex-wrap items-center justify-center">
        <div className="flex flex-col md:flex-row">
          <ContactInfo />
          <VerticalLine />
          <ContactForm />
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
