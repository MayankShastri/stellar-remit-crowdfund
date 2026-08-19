#![no_std]
use soroban_sdk::{
    contract, contractimpl, contracttype, symbol_short, Address, Env, Vec,
};

const DONATION: soroban_sdk::Symbol = symbol_short!("DONATION");
const WITHDRAWN: soroban_sdk::Symbol = symbol_short!("WITHDRAWN");

#[contracttype]
pub enum DataKey {
    Admin,
    Goal,
    TotalRaised,
    Donor(Address),
    DonorList,
}

#[contract]
pub struct Crowdfund;

#[contractimpl]
impl Crowdfund {
    pub fn initialize(env: Env, admin: Address, goal: i128) {
        if env.storage().instance().has(&DataKey::Admin) {
            panic!("already initialized");
        }
        assert!(goal > 0, "goal must be positive");
        env.storage().instance().set(&DataKey::Admin, &admin);
        env.storage().instance().set(&DataKey::Goal, &goal);
        env.storage().instance().set(&DataKey::TotalRaised, &0i128);
        env.storage().instance().set(&DataKey::DonorList, &Vec::<Address>::new(&env));
    }

    pub fn donate(env: Env, donor: Address, amount: i128) {
        assert!(amount > 0, "amount must be positive");

        let total: i128 = env.storage().instance().get(&DataKey::TotalRaised).unwrap();
        let new_total = total + amount;
        env.storage().instance().set(&DataKey::TotalRaised, &new_total);

        let donor_amount: i128 = env
            .storage()
            .instance()
            .get(&DataKey::Donor(donor.clone()))
            .unwrap_or(0);
        env.storage()
            .instance()
            .set(&DataKey::Donor(donor.clone()), &(donor_amount + amount));

        if donor_amount == 0 {
            let mut donors: Vec<Address> = env
                .storage()
                .instance()
                .get(&DataKey::DonorList)
                .unwrap();
            donors.push_back(donor.clone());
            env.storage()
                .instance()
                .set(&DataKey::DonorList, &donors);
        }

        env.storage().instance().extend_ttl(100, 518_400);

        env.events()
            .publish((DONATION, donor, new_total), amount);
    }

    pub fn withdraw(env: Env, admin: Address) {
        let stored_admin: Address = env.storage().instance().get(&DataKey::Admin).unwrap();
        admin.require_auth();
        assert!(admin == stored_admin, "unauthorized");

        let total: i128 = env.storage().instance().get(&DataKey::TotalRaised).unwrap();
        let goal: i128 = env.storage().instance().get(&DataKey::Goal).unwrap();
        assert!(total >= goal, "goal not yet reached");

        env.events().publish((WITHDRAWN, admin), total);
    }

    pub fn get_progress(env: Env) -> (i128, i128) {
        let total: i128 = env.storage().instance().get(&DataKey::TotalRaised).unwrap_or(0);
        let goal: i128 = env.storage().instance().get(&DataKey::Goal).unwrap_or(0);
        (total, goal)
    }

    pub fn get_donors(env: Env) -> Vec<(Address, i128)> {
        let donor_list: Vec<Address> = env
            .storage()
            .instance()
            .get(&DataKey::DonorList)
            .unwrap();
        let mut result = Vec::new(&env);
        for addr in donor_list.iter() {
            let amt: i128 = env
                .storage()
                .instance()
                .get(&DataKey::Donor(addr.clone()))
                .unwrap_or(0);
            result.push_back((addr, amt));
        }
        result
    }

    pub fn get_donor_amount(env: Env, donor: Address) -> i128 {
        env.storage()
            .instance()
            .get(&DataKey::Donor(donor))
            .unwrap_or(0)
    }

    pub fn get_admin(env: Env) -> Address {
        env.storage().instance().get(&DataKey::Admin).unwrap()
    }

    pub fn get_goal(env: Env) -> i128 {
        env.storage().instance().get(&DataKey::Goal).unwrap()
    }
}

#[cfg(test)]
mod test {
    use super::*;
    use soroban_sdk::{testutils::Address as _, Env};

    #[test]
    fn test_initialize_and_progress() {
        let env = Env::default();
        let admin = Address::generate(&env);
        let contract_id = env.register(Crowdfund, ());
        let client = CrowdfundClient::new(&env, &contract_id);

        client.initialize(&admin, &100_000_000);

        let (total, goal) = client.get_progress();
        assert_eq!(total, 0);
        assert_eq!(goal, 100_000_000);
    }

    #[test]
    fn test_donate() {
        let env = Env::default();
        let admin = Address::generate(&env);
        let donor1 = Address::generate(&env);
        let contract_id = env.register(Crowdfund, ());
        let client = CrowdfundClient::new(&env, &contract_id);

        client.initialize(&admin, &100_000_000);
        client.donate(&donor1, &50_000_000);

        let (total, _) = client.get_progress();
        assert_eq!(total, 50_000_000);

        let amt = client.get_donor_amount(&donor1);
        assert_eq!(amt, 50_000_000);
    }

    #[test]
    fn test_multiple_donors() {
        let env = Env::default();
        let admin = Address::generate(&env);
        let donor1 = Address::generate(&env);
        let donor2 = Address::generate(&env);
        let contract_id = env.register(Crowdfund, ());
        let client = CrowdfundClient::new(&env, &contract_id);

        client.initialize(&admin, &100_000_000);
        client.donate(&donor1, &30_000_000);
        client.donate(&donor2, &70_000_000);

        let (total, _) = client.get_progress();
        assert_eq!(total, 100_000_000);

        let donors = client.get_donors();
        assert_eq!(donors.len(), 2);
    }

    #[test]
    fn test_cannot_double_init() {
        let env = Env::default();
        let admin = Address::generate(&env);
        let contract_id = env.register(Crowdfund, ());
        let client = CrowdfundClient::new(&env, &contract_id);

        client.initialize(&admin, &100_000_000);

        let result = client.try_initialize(&admin, &100_000_000);
        assert!(result.is_err());
    }

    #[test]
    fn test_withdraw_before_goal_fails() {
        let env = Env::default();
        let admin = Address::generate(&env);
        let donor = Address::generate(&env);
        let contract_id = env.register(Crowdfund, ());
        let client = CrowdfundClient::new(&env, &contract_id);

        client.initialize(&admin, &100_000_000);
        client.donate(&donor, &50_000_000);

        env.mock_all_auths();
        let result = client.try_withdraw(&admin);
        assert!(result.is_err());
    }

    #[test]
    fn test_withdraw_after_goal() {
        let env = Env::default();
        let admin = Address::generate(&env);
        let donor = Address::generate(&env);
        let contract_id = env.register(Crowdfund, ());
        let client = CrowdfundClient::new(&env, &contract_id);

        client.initialize(&admin, &100_000_000);
        client.donate(&donor, &100_000_000);

        env.mock_all_auths();
        client.withdraw(&admin);
    }

    #[test]
    fn test_unauthorized_withdraw_fails() {
        let env = Env::default();
        let admin = Address::generate(&env);
        let other = Address::generate(&env);
        let donor = Address::generate(&env);
        let contract_id = env.register(Crowdfund, ());
        let client = CrowdfundClient::new(&env, &contract_id);

        client.initialize(&admin, &100_000_000);
        client.donate(&donor, &100_000_000);

        env.mock_all_auths();
        let result = client.try_withdraw(&other);
        assert!(result.is_err());
    }
}
