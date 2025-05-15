use anchor_lang::prelude::*;

declare_id!("MzCmSBr1L3gyFMKvK2QK9CriD5sgFKzgUrMphi79rP1");

#[program]
pub mod solanaday {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize {}
