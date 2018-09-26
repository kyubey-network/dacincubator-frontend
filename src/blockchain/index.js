import store from '../store';

// trick: 延迟求值，因为 webpack 会直接处理初始为 undefined 的 `store`， currentState 此处可以绕过
const currentState = () => store.state;
const currentGetters = () => store.getters;

export function getBalancesByContract({ tokenContract = 'eosio.token', accountName, symbol }) {
  return currentState().eos.getCurrencyBalance(tokenContract, accountName, symbol);
}

export function getMyBalancesByContract({ tokenContract = 'eosio.token', symbol }) {
  const accountName = currentGetters().account.name;
  return getBalancesByContract({ tokenContract, accountName, symbol });
}

export async function getTokenPrice() {
  const { rows } = await currentState().eos.getTableRows({
    json: 'true',
    code: 'dacincubator',
    scope: 'dacincubator',
    limit: 50,
    table: 'market',
  });
  const { supply } = rows[0];
  // @Magic Number: 10000000000 = 10^10
  return (
    Number(supply.slice(0, -5)) / 10000000000).toFixed(4);
}

export async function getMBalance() {
  const { rows } = await currentState().eos.getTableRows({
    json: 'true',
    code: 'dacincubator',
    scope: 'dacincubator',
    limit: 50,
    table: 'market',
  });
  const { balance } = rows[0];
  // @Magic Number: 10000000000 = 10^10
  return Number(balance.slice(0, -5));
}

export async function getSupply() {
  const { rows } = await currentState().eos.getTableRows({
    json: 'true',
    code: 'dacincubator',
    scope: 'dacincubator',
    limit: 50,
    table: 'market',
  });
  const { supply } = rows[0];
  // @Magic Number: 10000000000 = 10^10
  return Number(supply.slice(0, -5));
}

export async function getActions() {
  // async function below return `getActionsResult` (Check EOSJS api for detail)
  const { actions } = await currentState().eos.getActions('myeosgroupon', -1, -50);
  // Return actions for now
  return actions;
}
