"use client";

const ConnectButton = () => {
  return (
    <div className="flex justify-center">
      <appkit-button
        size="md"
        label="Connect Wallet"
        loadingLabel="Connecting..."
      />
    </div>
  );
};

export default ConnectButton;
