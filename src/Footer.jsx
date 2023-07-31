import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGithub } from '@fortawesome/free-brands-svg-icons';
import "./Footer.css";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer>
      <span>Copyright © {currentYear} Krackalackel02</span>
      <a href="https://github.com/krackalackel02" target="_blank">
      <FontAwesomeIcon icon={faGithub} />
      </a>
    </footer>
  );
}
