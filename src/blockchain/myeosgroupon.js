import { eos } from './store';

export async function getContractGlobal() {
  const { rows } = await eos().getTableRows({
    json: 'true',
    code: 'myeosgroupon',
    scope: 'myeosgroupon',
    limit: 50,
    table: 'global',
  });
  return rows;
}
export async function getCrowdSaleOrders() {
  const { rows } = await eos().getTableRows({
    json: 'true',
    code: 'myeosgroupon',
    scope: 'myeosgroupon',
    limit: 50,
    table: 'orders',
  });
  return rows;
}
