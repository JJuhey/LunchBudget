export interface DetailType {
  id: number;
  date: string;
  menu: string;
  amount: number;
  remain?: number;
  summaryId: number;
}

export interface SummaryType {
  id: number;
  settingId: number;
  month: string;
  budget: number;
  spendMoney: number;
  remainMoney: number;
}