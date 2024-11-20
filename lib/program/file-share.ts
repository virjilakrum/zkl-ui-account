{`import * as anchor from '@project-serum/anchor';
import { Program } from '@project-serum/anchor';
import { PublicKey, Connection, Keypair } from '@solana/web3.js';
import { AnchorWallet } from '@solana/wallet-adapter-react';

export interface FileShareAccount {
  accountId: string;
  owner: PublicKey;
  timestamp: anchor.BN;
}

export interface FileShare {
  ipfsHash: string;
  recipient: string;
  sender: PublicKey;
  timestamp: anchor.BN;
}

export const FILE_SHARE_PROGRAM_ID = new PublicKey(
  process.env.NEXT_PUBLIC_PROGRAM_ID || 'YOUR_PROGRAM_ID'
);

export class FileShareProgram {
  constructor(
    private program: Program,
    private wallet: AnchorWallet
  ) {}

  static async init(
    connection: Connection,
    wallet: AnchorWallet
  ): Promise<FileShareProgram> {
    const provider = new anchor.AnchorProvider(
      connection,
      wallet,
      { commitment: 'confirmed' }
    );
    
    const program = await Program.at(FILE_SHARE_PROGRAM_ID, provider);
    return new FileShareProgram(program, wallet);
  }

  async createAccount(accountId: string): Promise<string> {
    const [accountPda] = PublicKey.findProgramAddressSync(
      [
        Buffer.from('account'),
        this.wallet.publicKey.toBuffer(),
        Buffer.from(accountId)
      ],
      this.program.programId
    );

    const tx = await this.program.methods
      .createAccount(accountId)
      .accounts({
        account: accountPda,
        owner: this.wallet.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .rpc();

    return tx;
  }

  async createFileShare(
    ipfsHash: string,
    recipientId: string
  ): Promise<string> {
    const [sharePda] = PublicKey.findProgramAddressSync(
      [
        Buffer.from('file_share'),
        this.wallet.publicKey.toBuffer(),
        Buffer.from(ipfsHash)
      ],
      this.program.programId
    );

    const tx = await this.program.methods
      .createFileShare(ipfsHash, recipientId)
      .accounts({
        fileShare: sharePda,
        sender: this.wallet.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .rpc();

    return tx;
  }

  async getFileShares(): Promise<FileShare[]> {
    const shares = await this.program.account.fileShare.all([
      {
        memcmp: {
          offset: 8,
          bytes: this.wallet.publicKey.toBase58(),
        },
      },
    ]);

    return shares.map((share) => ({
      ipfsHash: share.account.ipfsHash,
      recipient: share.account.recipient,
      sender: share.account.sender,
      timestamp: share.account.timestamp,
    }));
  }
}`}