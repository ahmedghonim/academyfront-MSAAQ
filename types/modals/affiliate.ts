type Method = "wire" | "paypal";
type MethodsArray = Method[];
export type Affiliate = {
  affiliates_commission: string;
  balance: {
    member: number;
    earnings: number;
  };
  payout: {
    methods: MethodsArray;
    threshold: number;
  };
  can_withdraw_funds: boolean;
  stats: {
    total_referrals: number;
    total_referrals_with_purchases: number;
  };
};
