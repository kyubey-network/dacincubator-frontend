import { map, filter } from 'ramda';

export const convertTimestamp = map((receipt) => {
  const time = new Date(receipt.time_stamp * 1000).toLocaleString();
  return Object.assign(receipt, { time });
});

// `recepit` is a typo in the contract, not a typo for the front-end
export const getTheReceipt = map(({ action_trace }) => action_trace.act.data.recepit);

export const receiptFilter = filter((action) => {
  const { action_trace } = action;
  const { account, name } = action_trace.act;
  return account === 'myeosgroupon' && name === 'receipt';
});
