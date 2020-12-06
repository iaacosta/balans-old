export type FintualGoal = {
  id: string;
  type: string;
  attributes: {
    name: string;
    nav: number;
    created_at: string;
    timeframe: number;
    deposited: number;
    profit: number;
    investments: { weight: number; asset_id: number }[];
    public_link: string | null;
    param_id: number;
    goal_type: string;
    regime: string | null;
    completed: boolean;
    has_any_withdrawals: boolean;
  };
};
