import SpotlightText from "@/shared/components/SpotlightText";
import { faGithub, faLinkedin } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";

const CURRENT_YEAR = new Date().getFullYear();

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center">
      <div className="w-container mx-auto">
        <div className="flex flex-col gap-16 h-full justify-center">
          <div className="flex flex-col gap-8">
            <SpotlightText>
              <h1 className="text-lg md:text-xl text-gray-900 font-medium">
                404 - Page Not Found
                <br />
                <span className="text-gray-500 font-normal">
                  The page you're looking for doesn't exist.
                </span>
              </h1>
            </SpotlightText>

            <div className="flex flex-row gap-4">
              <SpotlightText>
                <Link
                  to="/"
                  className="rounded-full bg-gray-100 border border-gray-200 px-5 py-2 clickable text-gray-500 text-base flex flex-row items-center gap-3 font-medium"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Go back home
                </Link>
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
      </div>
    </div>
  );
}
