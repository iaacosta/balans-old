export type CategoryType = 'income' | 'expense';

export type AccountType = 'cash' | 'vista' | 'checking' | 'credit';

export type Then<T> = T extends PromiseLike<infer U> ? U : T;
