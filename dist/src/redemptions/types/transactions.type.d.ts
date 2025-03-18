export type TTransactionsResponse = {
    redemption_points: number;
    redemption_redeemed_at: string;
    customerPoints_points: number;
};
export type TResponseTransaction = {
    transactions: Array<TTransactionsResponse>;
    totalPointsReeedemed: number;
    totalPoints: number;
};
