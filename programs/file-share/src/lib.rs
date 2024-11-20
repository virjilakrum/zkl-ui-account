use anchor_lang::prelude::*;

declare_id!("YOUR_PROGRAM_ID");

#[program]
pub mod file_share {
    use super::*;

    pub fn create_account(ctx: Context<CreateAccount>, account_id: String) -> Result<()> {
        require!(account_id.len() == 10, ErrorCode::InvalidAccountId);

        let account = &mut ctx.accounts.account;
        account.owner = ctx.accounts.owner.key();
        account.account_id = account_id;
        account.timestamp = Clock::get()?.unix_timestamp;

        Ok(())
    }

    pub fn create_file_share(
        ctx: Context<CreateFileShare>,
        ipfs_hash: String,
        recipient_id: String,
    ) -> Result<()> {
        require!(recipient_id.len() == 10, ErrorCode::InvalidRecipientId);

        let file_share = &mut ctx.accounts.file_share;
        file_share.sender = ctx.accounts.sender.key();
        file_share.ipfs_hash = ipfs_hash;
        file_share.recipient = recipient_id;
        file_share.timestamp = Clock::get()?.unix_timestamp;

        Ok(())
    }
}

#[derive(Accounts)]
pub struct CreateAccount<'info> {
    #[account(
        init,
        payer = owner,
        space = AccountData::LEN,
        seeds = [
            b"account",
            owner.key().as_ref(),
            account_id.as_bytes()
        ],
        bump
    )]
    pub account: Account<'info, AccountData>,
    #[account(mut)]
    pub owner: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct CreateFileShare<'info> {
    #[account(
        init,
        payer = sender,
        space = FileShareData::LEN,
        seeds = [
            b"file_share",
            sender.key().as_ref(),
            ipfs_hash.as_bytes()
        ],
        bump
    )]
    pub file_share: Account<'info, FileShareData>,
    #[account(mut)]
    pub sender: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[account]
pub struct AccountData {
    pub owner: Pubkey,
    pub account_id: String,
    pub timestamp: i64,
}

#[account]
pub struct FileShareData {
    pub sender: Pubkey,
    pub ipfs_hash: String,
    pub recipient: String,
    pub timestamp: i64,
}

impl AccountData {
    const LEN: usize = 8 + // discriminator
        32 + // owner (Pubkey)
        4 + 10 + // account_id (String)
        8; // timestamp
}

impl FileShareData {
    const LEN: usize = 8 + // discriminator
        32 + // sender (Pubkey)
        4 + 64 + // ipfs_hash (String)
        4 + 10 + // recipient (String)
        8; // timestamp
}

#[error_code]
pub enum ErrorCode {
    #[msg("Account ID must be exactly 10 characters")]
    InvalidAccountId,
    #[msg("Recipient ID must be exactly 10 characters")]
    InvalidRecipientId,
}