import SpotlightText from "@/shared/components/SpotlightText";
import { faGithub, faLinkedin } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { FileText, Mail } from "lucide-react";

const CURRENT_YEAR = new Date().getFullYear();

export default function Footer() {
  return (
    <div className="flex flex-col gap-16 h-full justify-center w-full">
      <div className="flex flex-col gap-8">
        <SpotlightText>
          <h1 className="text-lg md:text-xl text-gray-900 font-medium">
            Maybe your story can inspire me too.
            <br />
            <span className="text-gray-500 font-normal">
              I'd love to hear from you!
            </span>
          </h1>
        </SpotlightText>

        <div className="flex flex-row gap-4">
          <SpotlightText>
            <a
              href="mailto:b.vinhan01@gmail.com"
              className="rounded-full bg-gray-100 border border-gray-200 px-5 py-2 clickable text-gray-500 text-base flex flex-row items-center gap-3 font-medium"
            >
              <Mail className="w-4 h-4" />
              Get in touch
            </a>
          </SpotlightText>
          <SpotlightText>
            <a
              href="https://www.linkedin.com/in/vin-bui/"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full bg-gray-100 border border-gray-200 clickable text-gray-500 text-base flex flex-row items-center justify-center gap-3 size-10"
              aria-label="Visit Vin's LinkedIn profile"
            >
              <FontAwesomeIcon icon={faLinkedin} className="w-4 h-4" />
            </a>
          </SpotlightText>
          <SpotlightText>
            <a
              href="https://github.com/vinnie4k"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full bg-gray-100 border border-gray-200 clickable text-gray-500 text-base flex flex-row items-center justify-center gap-3 size-10"
              aria-label="Visit Vin's GitHub profile"
            >
              <FontAwesomeIcon icon={faGithub} className="w-4 h-4" />
            </a>
          </SpotlightText>
          <SpotlightText>
            <a
              href="https://drive.google.com/file/d/1OnT9r7J92da_CVz9K7e_BXUB98A9K2PZ/view?usp=drive_link"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full bg-gray-100 border border-gray-200 clickable text-gray-500 text-base flex flex-row items-center justify-center gap-3 size-10"
              aria-label="View Vin's resume"
            >
              <FileText className="w-4 h-4" />
            </a>
          </SpotlightText>
        </div>
      </div>

      <p className="text-sm text-gray-500">
        Looking for my old portfolio?{" "}
        <a
          href="https://old.vinbui.me"
          target="_blank"
          rel="noopener noreferrer"
          className="font-semibold text-gray-800 clickable"
        >
          Click here.
        </a>
      </p>

      <div className="flex flex-row items-center justify-between">
        <p
          className="text-sm text-gray-600"
          aria-label={`Copyright ${CURRENT_YEAR}`}
        >
          &copy; {CURRENT_YEAR}
        </p>
        <p className="text-sm text-gray-600">
          Built with <span aria-label="love">♥️</span> by Vin.
        </p>
      </div>
    </div>
  );
}
