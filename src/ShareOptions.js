import React from "react";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { IoMdShare } from "react-icons/io";
import { FacebookIcon, FacebookShareButton, TwitterIcon, TwitterShareButton } from "react-share";
import "./ShareOptions.css";

const ShareOptions = ({ url }) => {
  // Text to share
  const shareText = "I just won today's LetRsets!";
  
  // Handler for after copy action
  const onCopy = () => {
    alert("URL copied to clipboard!");
  };

  return (
    <div className="shareOptions">
      <h3 className="shareText">Share the game</h3>
      <div className="buttonContainer">
        {/* Facebook Share Button */}
        <FacebookShareButton url={url} quote={shareText} className="Demo__some-network__share-button">
          <FacebookIcon size={40} round />
        </FacebookShareButton>
        
        {/* Twitter Share Button */}
        <TwitterShareButton url={url} title={shareText} className="Demo__some-network__share-button">
          <TwitterIcon size={40} round />
        </TwitterShareButton>

        {/* Copy to Clipboard Button */}
        <CopyToClipboard text={url} onCopy={onCopy}>
          <button title="Copy URL">
            <IoMdShare
              style={{
                backgroundColor: "orange",
                padding: "15px",
                borderRadius: "50px",
                color: "white",
              }}
            />
          </button>
        </CopyToClipboard>
      </div>
    </div>
  );
};

export default ShareOptions;
