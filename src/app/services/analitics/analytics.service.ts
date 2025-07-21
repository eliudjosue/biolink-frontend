import { Injectable } from '@angular/core';
import { Observable, of, map } from 'rxjs';
// import { ApiService } from './api.service';
import { AnalyticsData, PeriodComparison, AnalyticsResponse } from '../../models/analitics.interface';
import { Link } from '../../models/link.interface';
import { LinksService } from '../links/links.service';

/**
 * Servicio para gestionar los analytics del usuario
 */
@Injectable({
  providedIn: 'root'
})
export class AnalyticsService {
  constructor(
    // private apiService: ApiService,
    private linkService: LinksService
  ) {}

  /**
   * Obtiene los datos de analytics basados en los links del usuario
   */
  getAnalytics(period: string = '30d'): Observable<AnalyticsResponse<AnalyticsData>> {
    return this.linkService.getLinks().pipe(
      map(response => {
       if (response) {
  const analytics = this.generateAnalyticsFromLinks(response, period);
  const comparison = this.generatePeriodComparison(response, period);

  if (analytics.data && comparison.data) {
    analytics.data.clicksChange = comparison.data.clicksChange;
    analytics.data.viewsChange = comparison.data.viewsChange;
    analytics.data.ctrChange = comparison.data.ctrChange;
  }

  return analytics;
}

        return { success: false, message: 'No se pudieron cargar los links' };
      })
    );
  }

  /**
   * Obtiene la comparación entre períodos basada en los links
   */
  getPeriodComparison(period: string = '30d'): Observable<AnalyticsResponse<PeriodComparison>> {
    return this.linkService.getLinks().pipe(
      map(response => {
        if (response) {
          return this.generatePeriodComparison(response, period);
        }
        return { success: false, message: 'No se pudieron cargar los links' };
      })
    );
  }

  /**
   * Genera datos de analytics basados en los links reales
   */
  private generateAnalyticsFromLinks(links: Link[], period: string): AnalyticsResponse<AnalyticsData> {
    const totalClicks = links.reduce((sum, link) => sum + link.click_count, 0);
    const totalLinks = links.length;
    const activeLinks = links.filter(link => link.click_count > 0).length;

    // Simular vistas basadas en clicks (aproximadamente 2-3 vistas por click)
    const totalViews = Math.floor(totalClicks * (2 + Math.random()));
    const clickThroughRate = totalViews > 0 ? (totalClicks / totalViews) * 100 : 0;

    // Generar datos diarios simulados basados en el período
    const days = this.getPeriodDays(period);
    const today = new Date();
    const dailyStats = [];

    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);

      // Distribuir clicks de manera realista a lo largo del período
      const dayClicks = Math.floor((totalClicks / days) * (0.5 + Math.random()));
      const dayViews = Math.floor(dayClicks * (2 + Math.random()));

      dailyStats.push({
        date: date.toISOString().split('T')[0],
        clicks: dayClicks,
        views: dayViews,
        uniqueVisitors: Math.floor(dayViews * 0.8)
      });
    }

    // Crear top links basado en clicks reales
    const topLinks = links
      .sort((a, b) => b.click_count - a.click_count)
      .slice(0, 5)
      .map(link => ({
        id: link.id,
        title: link.title,
        url: link.url,
        click_count: link.click_count,
        clickPercentage: totalClicks > 0 ? (link.click_count / totalClicks) * 100 : 0,
        uniqueClicks: Math.floor(link.click_count * 0.8),
        conversionRate: Math.random() * 20 + 5
      }));

    return {
      success: true,
      data: {
        totalClicks,
        totalViews,
        clickThroughRate,
        activeLinks,
        totalLinks,
        clicksChange: 0, // se sobrescribirá con valor real
        viewsChange: 0,
        ctrChange: 0,
        dailyStats,
        topLinks
      }
    };
  }

  /**
   * Genera comparación de períodos basada en los links
   */
  private generatePeriodComparison(links: Link[], period: string): AnalyticsResponse<PeriodComparison> {
    const currentClicks = links.reduce((sum, link) => sum + link.click_count, 0);
    const currentViews = Math.floor(currentClicks * (2 + Math.random()));

    // Simular período anterior (con variación del 80-120% del actual)
    const variation = 0.8 + Math.random() * 0.4;
    const previousClicks = Math.floor(currentClicks * variation);
    const previousViews = Math.floor(currentViews * variation);

    const currentCtr = currentViews > 0 ? (currentClicks / currentViews) * 100 : 0;
    const previousCtr = previousViews > 0 ? (previousClicks / previousViews) * 100 : 0;

    const clicksChange = previousClicks > 0 ? ((currentClicks - previousClicks) / previousClicks) * 100 : 0;
    const viewsChange = previousViews > 0 ? ((currentViews - previousViews) / previousViews) * 100 : 0;
    const ctrChange = previousCtr > 0 ? ((currentCtr - previousCtr) / previousCtr) * 100 : 0;

    return {
      success: true,
      data: {
        current: {
          clicks: currentClicks,
          views: currentViews,
          uniqueVisitors: Math.floor(currentViews * 0.8),
          ctr: currentCtr
        },
        previous: {
          clicks: previousClicks,
          views: previousViews,
          uniqueVisitors: Math.floor(previousViews * 0.8),
          ctr: previousCtr
        },
        clicksChange,
        viewsChange,
        ctrChange
      }
    };
  }

  /**
   * Obtiene el número de días según el período
   */
  private getPeriodDays(period: string): number {
    switch (period) {
      case '7d': return 7;
      case '30d': return 30;
      case '90d': return 90;
      case '1y': return 365;
      default: return 30;
    }
  }
}
