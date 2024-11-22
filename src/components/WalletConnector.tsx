import {AnyAptosWallet} from "@aptos-labs/wallet-adapter-react";
import {Breakpoint} from "@mui/material";
import WalletButton from "./WalletButton";
import WalletsModal from "./WalletModal";

export interface WalletConnectorProps {
  networkSupport?: string;
  handleNavigate?: () => void;
  /**
   * An optional function for sorting wallets that are currently installed or
   * loadable in the wallet connector modal.
   */
  sortDefaultWallets?: (a: AnyAptosWallet, b: AnyAptosWallet) => number;
  /**
   * An optional function for sorting wallets that are NOT currently installed or
   * loadable in the wallet connector modal.
   */
  sortMoreWallets?: (a: AnyAptosWallet, b: AnyAptosWallet) => number;
  /** The max width of the wallet selector modal. Defaults to `xs`. */
  modalMaxWidth?: Breakpoint;
  setWalletConnectModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  walletConnectModalOpen: boolean;
}

export function WalletConnector({
  networkSupport,
  handleNavigate,
  sortDefaultWallets,
  sortMoreWallets,
  modalMaxWidth,
  setWalletConnectModalOpen,
  walletConnectModalOpen,
}: WalletConnectorProps) {
  const handleModalOpen = () => setWalletConnectModalOpen(true);
  const handleClose = () => setWalletConnectModalOpen(false);

  return (
    <>
      <WalletButton
        handleModalOpen={handleModalOpen}
        handleNavigate={handleNavigate}
      />
      <WalletsModal
        handleClose={handleClose}
        modalOpen={walletConnectModalOpen}
        networkSupport={networkSupport}
        sortDefaultWallets={sortDefaultWallets}
        sortMoreWallets={sortMoreWallets}
        maxWidth={modalMaxWidth}
      />
    </>
  );
}
