import { Component, Input, OnInit, SimpleChanges, OnDestroy } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import { SalesService } from '../../service/sales.service';
import { catchError, of } from 'rxjs';

@Component({
  selector: 'app-product-sale',
  templateUrl: './product-sale.component.html',
  styleUrls: ['./product-sale.component.scss']
})
export class ProductSaleComponent implements OnInit, OnDestroy {
  @Input() fromMonth!: number;
  @Input() toMonth!: number;
  chart!: Chart<'pie', number[], string>;
  mainEmpId: string | null;
  entityId: string | null;
  financialYear_id: string | null;

  constructor(private dashboardService: SalesService) {}

  ngOnInit(): void {
    this.mainEmpId = localStorage.getItem('EmpMainId');
    this.entityId = localStorage.getItem('selectedEntityId');
    this.financialYear_id = localStorage.getItem('financial_id');
    Chart.register(...registerables);
    this.getTotalSalesProductWise();
  }
  ngAfterViewInit(): void {
    this.createChart([], []);
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['fromMonth'] || changes['toMonth']) {
      this.getTotalSalesProductWise();
    }
  }

  getTotalSalesProductWise(): void {
    const data = {
      fromMonth: this.fromMonth,
      toMonth: this.toMonth,
      financial_id: this.financialYear_id,
    };

     this.dashboardService.getTotalSalesProductWise(this.entityId, data).pipe(
      catchError((error)=>{
        if(error.status){
          console.error('Data not found: 404');
          this.updateChart([], []);
          return of([]);
        }else {
          console.error('An error occurred:', error);
          return of([]);
        }
      })
     ).subscribe((res: any) => {
      if (res) {
        const labels = res.data?.map((item: any) => item.product_name);
        const data = res.data?.map((item: any) => item.sales_percentage);
        this.updateChart(labels,data);
      } else {
        this.updateChart([], []); 
      }
    });
  }

  createChart(labels: string[], data: number[]): void {
    const canvas = document.getElementById('pieChart') as HTMLCanvasElement;
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      console.error('Failed to get canvas context');
      return;
    }

    const gradientColors = this.generateGradientColors(ctx, data?.length);
    const hoverColors = this.generateHoverColors(data?.length);

    this.chart = new Chart<'pie', number[], string>(ctx, {
      type: 'pie',
      data: {
        labels: labels,
        datasets: [
          {
            data: data,
            backgroundColor: gradientColors,
            hoverBackgroundColor: hoverColors,
            borderColor: '#ffffff',
            borderWidth: 3,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            display: true,
            position: 'top',
          },
          tooltip: {
            callbacks: {
              label: (context) => `${context.label}: ${context.raw as number}%`,
            },
          },
        },
      },
    });
  }

  updateChart(labels: string[], data: number[]): void {
    if (this.chart) {
      this.chart.destroy(); 
    }
    this.createChart(labels, data); 
  }

  generateGradientColors(ctx: CanvasRenderingContext2D, numSlices: number): CanvasGradient[] {
    const colors = [
      '#007bff', '#208AAE', '#FF6978', '#ffa726', '#9c27b0',
      "#4169E1", "#DC143C", "#50C878", "#673AB7", "#FF4500",
      "#008080", "#FFD700", "#FF6F61", "#708090", "#191970",
      "#40E0D0", "#E6E6FA", "#FFB7C5", "#E97451", "#0F52BA",
      "#FFFFF0", "#228B22", "#8B00FF", "#B76E79", "#36454F"
    ];
    const gradients: CanvasGradient[] = [];

    for (let i = 0; i < numSlices; i++) {
      const gradient = ctx.createLinearGradient(0, 0, 0, 600);
      gradient.addColorStop(0, colors[i % colors.length]);
      gradient.addColorStop(1, '#ffffff');
      gradients.push(gradient);
    }

    return gradients;
  }

  generateHoverColors(numSlices: number): string[] {
    const hoverColors = [
      '#0056b3', '#176F84', '#D9475A', '#e6951c', '#7a1c89',
      "#3154A0", "#A20E2C", "#3A9E69", "#4B2D74", "#D23700",
      "#006666", "#D4AF37", "#E55347", "#5A6E75", "#0F3057",
      "#35B0A5", "#C9C9E2", "#D696A5", "#C46243", "#0C3E7A",
      "#E6E6D6", "#1C751C", "#6D00CC", "#985865", "#262D38"
    ];
    
    return Array.from({ length: numSlices }, (_, i) => hoverColors[i % hoverColors.length]);
  }

  ngOnDestroy(): void {
    if (this.chart) {
      this.chart.destroy();
    }
  }
}
