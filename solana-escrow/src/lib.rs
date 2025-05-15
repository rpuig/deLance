use solana_program::{
    account_info::{next_account_info, AccountInfo},
    entrypoint,
    entrypoint::ProgramResult,
    msg,
    pubkey::Pubkey,
    program_pack::{IsInitialized, Pack, Sealed},
    program_error::ProgramError,
};
use borsh::{BorshDeserialize, BorshSerialize};

#[derive(BorshSerialize, BorshDeserialize, Debug)]
pub struct Escrow {
    pub is_initialized: bool,
    pub initializer_pubkey: Pubkey,
    pub amount: u64,
}

impl Sealed for Escrow {}
impl IsInitialized for Escrow {
    fn is_initialized(&self) -> bool {
        self.is_initialized
    }
}

entrypoint!(process_instruction);
fn process_instruction(
    program_id: &Pubkey,
    accounts: &[AccountInfo],
    _instruction_data: &[u8],
) -> ProgramResult {
    let accounts_iter = &mut accounts.iter();
    let escrow_account = next_account_info(accounts_iter)?;

    let mut escrow_data = Escrow::try_from_slice(&escrow_account.data.borrow())?;
    
    if escrow_data.is_initialized {
        return Err(ProgramError::AccountAlreadyInitialized);
    }

    escrow_data.is_initialized = true;
    escrow_data.amount = 1000;
    escrow_data.serialize(&mut &mut escrow_account.data.borrow_mut()[..])?;

    msg!("Escrow initialized successfully");
    Ok(())
}
