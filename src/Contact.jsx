import React from 'react'
import styles from "./Contact.module.css";

export default function Contact() {
  return (
    <div className={styles["contact-content"]}>
        <h1>Contact Us</h1>
        <p>
          At <strong>Pitstop Portal</strong>, your feedback is important to us. 
          Whether you have a question about our data, suggestions for features, or any 
          issues you're experiencing with our website, we're here to help. 
          Don't hesitate to reach out and our team will get back to you as soon as possible.
        </p>
        <p>Please fill out the form below or contact us at <strong>support@pitstopportal.com</strong>.</p>
    </div>
  )
}
