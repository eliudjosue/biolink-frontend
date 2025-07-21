/**
 * Interfaz para los datos de analytics
 */
export interface AnalyticsData {
  totalClicks: number;
  totalViews: number;
  clickThroughRate: number;
  activeLinks: number;
  totalLinks: number;
  clicksChange: number;
  viewsChange: number;
  ctrChange: number;
  dailyStats: DailyStat[];
  topLinks: LinkAnalytics[];
}

/**
 * Interfaz para estadísticas diarias
 */
export interface DailyStat {
  date: string;
  clicks: number;
  views: number;
  uniqueVisitors: number;
}

/**
 * Interfaz para analytics de links individuales
 */
export interface LinkAnalytics {
  id: string;
  title: string;
  url: string;
  click_count: number;
  clickPercentage: number;
  uniqueClicks: number;
  conversionRate: number;
}

/**
 * Interfaz para comparación de períodos
 */
export interface PeriodComparison {
  current: PeriodStats;
  previous: PeriodStats;
  clicksChange: number;
  viewsChange: number;
  ctrChange: number;
}

/**
 * Interfaz para estadísticas de período
 */
export interface PeriodStats {
  clicks: number;
  views: number;
  uniqueVisitors: number;
  ctr: number;
}

/**
 * Interfaz para la respuesta de la API de analytics
 */
export interface AnalyticsResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}