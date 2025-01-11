export type TTransactionsResponse = {
  customer_id: number;
  customer_nit: string;
  customer_name: string;
  redemption_id: number;
  redemption_customer_id: number;
  redemption_points: number;
  redemption_redeemed_at: string;
};

export type TResponseTransaction = {
  transactions: Array<TTransactionsResponse>;
  totalPointsReeedemed: number;
};
