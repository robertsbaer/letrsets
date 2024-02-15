import React from "react";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { IoMdShare } from "react-icons/io";
import {
  FacebookIcon,
  FacebookShareButton,
  TwitterIcon,
  TwitterShareButton,
} from "react-share";
import "./ShareOptions.css";
import translations from "./translations"; // Import the translations


const ShareOptions = ({ url, language }) => {
  // Text to share
  const shareText = "I just won today's LetRsets!";

  // Handler for after copy action
  const onCopy = () => {
    alert("URL copied to clipboard!");
  };

  return (
    <div className="shareOptions">
      <h3 className="shareText">{translations[language].shareGame}</h3>
      <div className="buttonContainer">
        {/* Facebook Share Button */}
        <FacebookShareButton
          url={url}
          quote={shareText}
          className="Demo__some-network__share-button"
        >
          <FacebookIcon size={62} round />
        </FacebookShareButton>

        {/* Twitter Share Button */}
        <TwitterShareButton
          url={url}
          title={shareText}
          className="Demo__some-network__share-button"
        >
          <TwitterIcon size={62} round />
        </TwitterShareButton>

        {/* Copy to Clipboard Button */}
        <CopyToClipboard text={url} onCopy={onCopy}>
          <button title="Copy URL">
            <IoMdShare
              style={{
                fontSize: "34px",
                backgroundColor: "orange",
                padding: "15px",
                borderRadius: "50px",
                color: "white",
              }}
            />
          </button>
        </CopyToClipboard>
      </div>
      <div className="buyMeCoffeeContainer">
        <a
          href="https://www.buymeacoffee.com/robertbaer"
          rel="noreferrer"
          target="_blank"
        >
          <img
            src="https://img.buymeacoffee.com/button-api/?text=Buy me a coffee&emoji=&slug=robertbaer&button_colour=FFDD00&font_colour=000000&font_family=Cookie&outline_colour=000000&coffee_colour=ffffff"
            alt="Buy me a coffee button"
          />
        </a>
      </div>
    </div>
  );
};

export default ShareOptions;
