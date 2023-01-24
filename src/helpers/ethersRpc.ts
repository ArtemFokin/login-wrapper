import { ethers } from "ethers";

export default class EthereumRpc {
  private provider;
  private ethersProvider: ethers.providers.Web3Provider;

  constructor(provider: any) {
    this.provider = provider;
    this.ethersProvider = new ethers.providers.Web3Provider(this.provider);
  }

  async getChainId() {
    try {
      const networkDetails = await this.ethersProvider.getNetwork();
      return networkDetails.chainId;
    } catch (error) {
      return error;
    }
  }

  async getAccount() {
    const signer = this.ethersProvider.getSigner();

    // Get user's Ethereum public address
    const address = await signer.getAddress();

    return address;
  }

  async getBalance() {
    try {
      const signer = this.ethersProvider.getSigner();

      // Get user's Ethereum public address
      const address = await signer.getAddress();

      // Get user's balance in ether
      const balance = ethers.utils.formatEther(
        await this.ethersProvider.getBalance(address) // Balance is in wei
      );

      return balance;
    } catch (error) {
      return error as string;
    }
  }

  async sendTransaction() {
    try {
      const signer = this.ethersProvider.getSigner();

      const destination = "0x40e1c367Eca34250cAF1bc8330E9EddfD403fC56";

      // Convert 1 ether to wei
      const amount = ethers.utils.parseEther("0.001");

      // Submit transaction to the blockchain
      const tx = await signer.sendTransaction({
        to: destination,
        value: amount,
        maxPriorityFeePerGas: "5000000000", // Max priority fee per gas
        maxFeePerGas: "6000000000000", // Max fee per gas
      });

      // Wait for transaction to be mined
      const receipt = await tx.wait();

      return receipt;
    } catch (error) {
      return error as string;
    }
  }

  async signMessage(message: string) {
    const signer = this.ethersProvider.getSigner();

    const signedMessage = await signer.signMessage(message);

    return signedMessage;
  }

  async getPrivateKey() {
    try {
      const privateKey = await this.provider.request({
        method: "eth_private_key",
      });

      return privateKey;
    } catch (error) {
      return error as string;
    }
  }
}
