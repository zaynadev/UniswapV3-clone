import React, { useEffect } from "react";
import PageButton from "./../components/PageButton";

const ConnectButton = (props) => {
  const { isConnected, signerAddress, getSigner, provider } = props;

  return (
    <>
      {isConnected() ? (
        <div className="buttonContainer">
          <PageButton
            name={`${signerAddress.slice(0, 10)}...${signerAddress.slice(-4)}`}
          />
        </div>
      ) : (
        <div className="btn my-2 connectButton" onClick={() => getSigner()}>
          Connect Wallet
        </div>
      )}
    </>
  );
};

export default ConnectButton;
