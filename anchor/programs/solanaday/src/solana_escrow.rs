use anchor_lang::prelude::*;

declare_id!("YourProgramIdHere");

#[program]
pub mod solana_escrow {
    use super::*;

    pub fn initialize_escrow(ctx: Context<InitializeEscrow>, amount: u64) -> Result<()> {
        let escrow_account = &mut ctx.accounts.escrow_account;
        escrow_account.amount = amount;
        Ok(())
    }
}

#[derive(Accounts)]
pub struct InitializeEscrow<'info> {
    #[account(init, payer = user, space = 8 + 8)]
    pub escrow_account: Account<'info, Escrow>,
    #[account(mut)]
    pub user: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[account]
pub struct Escrow {
    pub amount: u64,
}
