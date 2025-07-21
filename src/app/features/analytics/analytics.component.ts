import { CommonModule } from '@angular/common';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { User } from '../../models/user.interface';
import { AnalyticsData, LinkAnalytics, PeriodComparison } from '../../models/analitics.interface';
import { Chart, ChartConfiguration, registerables } from 'chart.js';
import { AuthService } from '../../services/auth/auth.service';
import { AnalyticsService } from '../../services/analitics/analytics.service';

@Component({
  selector: 'app-analytics',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './analytics.component.html',
  styleUrl: './analytics.component.scss'
})
export class AnalyticsComponent {
 @ViewChild('clicksChart') clicksChartRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('viewsChart') viewsChartRef!: ElementRef<HTMLCanvasElement>;

  currentUser: string | null = null;
  analyticsData: AnalyticsData | null = null;
  periodComparison: PeriodComparison | null = null;
  loading = true;
  selectedPeriod = '30d';

  clicksChart: Chart | null = null;
  viewsChart: Chart | null = null;

  periods = [
    { label: '7D', value: '7d' },
    { label: '30D', value: '30d' },
    { label: '90D', value: '90d' },
    { label: '1A', value: '1y' }
  ];

  constructor(
    private authService: AuthService,
    private analyticsService: AnalyticsService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    this.loadAnalytics();
  }

  ngAfterViewInit(): void {
    // Los gráficos se crearán después de cargar los datos
  }

  /**
   * Carga los datos de analytics
   */
  loadAnalytics(): void {
    this.loading = true;
    
    this.analyticsService.getAnalytics(this.selectedPeriod).subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.analyticsData = response.data;
          this.loadPeriodComparison();
          
          // Crear gráficos después de cargar los datos
          setTimeout(() => {
            this.createCharts();
          }, 100);
        }
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading analytics:', error);
        this.loading = false;
      }
    });
  }

  /**
   * Carga la comparación de períodos
   */
  loadPeriodComparison(): void {
    this.analyticsService.getPeriodComparison(this.selectedPeriod).subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.periodComparison = response.data;
        }
      },
      error: (error) => {
        console.error('Error loading period comparison:', error);
      }
    });
  }

  /**
   * Cambia el período seleccionado
   */
  changePeriod(period: string): void {
    this.selectedPeriod = period;
    this.destroyCharts();
    this.loadAnalytics();
  }

  /**
   * Crea los gráficos de Chart.js
   */
  createCharts(): void {
    if (!this.analyticsData) return;

    this.createClicksChart();
    this.createViewsChart();
  }

  /**
   * Crea el gráfico de clicks
   */
  createClicksChart(): void {
    if (!this.clicksChartRef || !this.analyticsData) return;

    const ctx = this.clicksChartRef.nativeElement.getContext('2d');
    if (!ctx) return;

    const config: ChartConfiguration = {
      type: 'line',
      data: {
        labels: this.analyticsData.dailyStats.map(stat => stat.date),
        datasets: [{
          label: 'Clicks',
          data: this.analyticsData.dailyStats.map(stat => stat.clicks),
          borderColor: '#667eea',
          backgroundColor: 'rgba(102, 126, 234, 0.1)',
          borderWidth: 3,
          fill: true,
          tension: 0.4,
          pointBackgroundColor: '#667eea',
          pointBorderColor: '#ffffff',
          pointBorderWidth: 2,
          pointRadius: 5,
          pointHoverRadius: 7
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false
          }
        },
        scales: {
          x: {
            type: 'time',
            time: {
              unit: 'day',
              displayFormats: {
                day: 'MMM dd'
              }
            },
            grid: {
              display: false
            }
          },
          y: {
            beginAtZero: true,
            grid: {
              color: 'rgba(0,0,0,0.1)'
            }
          }
        },
        elements: {
          point: {
            hoverBackgroundColor: '#667eea'
          }
        }
      }
    };

    this.clicksChart = new Chart(ctx, config);
  }

  /**
   * Crea el gráfico de vistas
   */
  createViewsChart(): void {
    if (!this.viewsChartRef || !this.analyticsData) return;

    const ctx = this.viewsChartRef.nativeElement.getContext('2d');
    if (!ctx) return;

    const config: ChartConfiguration = {
      type: 'bar',
      data: {
        labels: this.analyticsData.dailyStats.map(stat => stat.date),
        datasets: [{
          label: 'Vistas',
          data: this.analyticsData.dailyStats.map(stat => stat.views),
          backgroundColor: 'rgba(245, 87, 108, 0.8)',
          borderColor: '#f5576c',
          borderWidth: 1,
          borderRadius: 8,
          borderSkipped: false
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false
          }
        },
        scales: {
          x: {
            type: 'time',
            time: {
              unit: 'day',
              displayFormats: {
                day: 'MMM dd'
              }
            },
            grid: {
              display: false
            }
          },
          y: {
            beginAtZero: true,
            grid: {
              color: 'rgba(0,0,0,0.1)'
            }
          }
        }
      }
    };

    this.viewsChart = new Chart(ctx, config);
  }

  /**
   * Destruye los gráficos existentes
   */
  destroyCharts(): void {
    if (this.clicksChart) {
      this.clicksChart.destroy();
      this.clicksChart = null;
    }
    if (this.viewsChart) {
      this.viewsChart.destroy();
      this.viewsChart = null;
    }
  }

  /**
   * Obtiene la clase CSS para el cambio de métrica
   */
  getChangeClass(change: number): string {
    if (change > 0) return 'positive';
    if (change < 0) return 'negative';
    return 'neutral';
  }

  /**
   * Formatea el cambio de métrica
   */
  formatChange(change: number): string {
    const sign = change > 0 ? '+' : '';
    return `${sign}${change.toFixed(1)}%`;
  }

  /**
   * Formatea la URL para mostrar
   */
  formatUrl(url: string): string {
    try {
      const urlObj = new URL(url);
      return urlObj.hostname.replace('www.', '');
    } catch {
      return url;
    }
  }

  /**
   * Función de tracking para la lista de links
   */
  trackByLinkId(index: number, link: LinkAnalytics): string {
    return link.id;
  }

  /**
   * Navega hacia atrás
   */
  goBack(): void {
    this.router.navigate(['/dashboard']);
  }

  ngOnDestroy(): void {
    this.destroyCharts();
  }
}
