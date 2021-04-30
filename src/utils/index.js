import { SALDO_CONTA_RESPONSE } from "../variables";

export const SaldoFormatter = message => {
  if (!message.startsWith(SALDO_CONTA_RESPONSE)) return;
  
  const a = message.search(/R\$/);
  const b = message.slice(a);
  const c = b.search(/ e seu/);
  
  return b.slice(0, c);
}

export const AccountNumberFormatter = message => {
  if (!message.startsWith(SALDO_CONTA_RESPONSE)) return;
  
  const a = message.search(/c\/c XX/);
  const b = message.slice(a + 4);
  const c = b.search(/ e R\$/);
  
  return b.slice(0, c);
}