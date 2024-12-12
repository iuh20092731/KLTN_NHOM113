export interface ClickTrackingReport {
  type: number;
  valueId: number;
  name: string;
  clickCount: number;
  lastClicked: string;
  previousMonthClickCount: number;
}

export interface ClickTrackingState {
  reports: ClickTrackingReport[];
  loading: boolean;
  error: string | null;
}

export interface ClickTrackingReportV2 {
  type: number;
  imageLink: string;
  valueId: number;
  categoryName: string;
  clickCount: number;
  lastClicked: string;
  previousMonthClickCount: number;
} 