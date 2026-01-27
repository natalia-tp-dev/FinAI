import { Component, computed, effect, inject, OnInit, signal, ViewChild } from '@angular/core';
import { BaseChartDirective, provideCharts, withDefaultRegisterables } from 'ng2-charts';
import { ChartConfiguration, ChartData, ChartType } from 'chart.js';
import { User } from '../../../../../services/user/user';
import { DashboardService } from '../../../../../services/dashboard/dashboard';
import { TransactionService } from '../../../../../services/transactions/transaction';

@Component({
  selector: 'app-dashboard',
  imports: [BaseChartDirective],
  providers: [provideCharts(withDefaultRegisterables())],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})

export class Dashboard implements OnInit {
  @ViewChild('lineChart') lineChart?: BaseChartDirective
  @ViewChild('pieChart') pieChart?: BaseChartDirective
  
  private staticsService = inject(DashboardService)
  private userService = inject(User)
  private transactionService = inject(TransactionService)

  public hasData = computed(() => {
    const hasBalance = Number(this.balance()) > 0
    const hasChartLabels = Number(this.chartData.labels?.length ?? 0) > 0
    const hasPieData = (this.pieChartData.datasets[0].data?.length ?? 0) > 0;
    
    return hasBalance || hasChartLabels || hasPieData;
  })

  public balance = signal<Number>(0)
  public incomes = signal<Number>(0)
  public expenses = signal<Number>(0)

  public chartType: ChartType = 'line'

  public chartData: ChartData<'line'> = {
    labels: [],
    datasets: [
      {
        data: [],
        label: 'Incomes',
        borderColor: '#22c55e',
        backgroundColor: 'rgba(34, 197, 94, 0.2)',
        fill: 'origin',
        tension: 0.4,
        pointRadius: 0
      },
      {
        data: [],
        label: 'Expenses',
        borderColor: '#ef4444',
        backgroundColor: 'rgba(239, 68, 68, 0.2)',
        fill: 'origin',
        tension: 0.4,
        pointRadius: 0
      }
    ]
  };

  public chartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    

    interaction: {
      mode: 'index',
      intersect: false,
    },

    plugins: {
      legend: { display: false },
      tooltip: {
        enabled: true,
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        titleColor: '#1e293b',
        bodyColor: '#475569',
        borderColor: '#e2e8f0',
        borderWidth: 1,
        padding: 12,
        displayColors: true,
        callbacks: {
          label: (context) => ` ${context.dataset.label}: $${context.parsed.y}`
        }
      }
    },

    scales: {
      y: {
        beginAtZero: true,
        grid: { color: '#f1f5f9' },
        ticks: {
          callback: (value) => '$' + value
        }
      },
      x: {
        grid: { display: false }
      }
    },


    hover: {
      mode: 'index',
      intersect: false
    }
  };

  public pieChartOptions: ChartConfiguration<'pie'>['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    animation: {
      duration: 2000,
      easing: 'easeOutQuart'
    },
    // @ts-ignore 
    animateRotate: true,
    // @ts-ignore
    animateScale: true,
    plugins: {
      legend: { position: 'bottom' }
    }
  };

  public pieChartData: ChartData<'pie'> = {
    labels: [],
    datasets: [{
      data: [],
      backgroundColor: ['#22c55e', '#ef4444', '#3b82f6', '#f59e0b', '#a580fdff', '#ff6db6ff'],
      hoverOffset: 4
    }]
  }

  constructor() {
    effect(() => {
      const id = this.userService.userId();
      const refreshTrigger = this.transactionService.refreshSignal()
      if (id) {
        this.loadDataDashboards(id);
        this.loadValues(id);
      }
    });
  }

  ngOnInit(): void {
    if (!this.userService.userId()) {
      this.userService.getProfile().subscribe();
    }
  }

  loadDataDashboards(userId: string) {
    this.staticsService.getYearlyTrend(userId).subscribe({
      next: (res: any) => {
        const data = res.formattedData;

        if (data && Array.isArray(data)) {
          this.chartData.labels = data.map(item => item.name);

          this.chartData.datasets[0].data = data.map(item =>
            item.series.find((s: any) => s.name === 'Incomes')?.value || 0
          );

          this.chartData.datasets[1].data = data.map(item =>
            item.series.find((s: any) => s.name === 'Expenses')?.value || 0
          );

          this.lineChart?.update()
        }
      },
      error: err => console.error(err)
    })

    this.staticsService.getCategoriesExpenses(userId).subscribe({
      next: res => {
        this.pieChartData.labels = res.labels
        this.pieChartData.datasets[0].data = res.values
        this.pieChart?.update()
      }
    })
  }

  loadValues(userId: string) {
    this.staticsService.getTotalBalance(userId).subscribe({
      next: (res:any) => {
        this.balance.set(res.totalBalance)
        this.incomes.set(res.totalIncomes)
        this.expenses.set(res.totalExpenses)
      }
    })
  }
}
