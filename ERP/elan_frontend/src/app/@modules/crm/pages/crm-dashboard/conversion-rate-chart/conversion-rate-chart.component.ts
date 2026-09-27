import { Component, OnDestroy } from '@angular/core';
import Chart from 'chart.js/auto';
import { SalesService } from '../../sales.service';

@Component({
  selector: 'app-conversion-rate-chart',
  templateUrl: './conversion-rate-chart.component.html',
  styleUrls: ['./conversion-rate-chart.component.scss']
})
export class ConversionRateChartComponent implements OnDestroy {
  entityId: string | null;
  conversionRate: number = 0;
  currentRate: number = 0; 
  
  constructor(private dashboardService: SalesService) {}

  ngOnInit(): void {
    this.entityId = localStorage.getItem('selectedEntityId');
    this.getConversionRate();
  }

  getConversionRate() {
    this.dashboardService.getConversionRate(this.entityId).subscribe((res: any) => {
      this.conversionRate = res.data.conversionRate;
      this.animateNeedle(); 
    });
  }

  private drawNeedlePlugin = {
    id: 'drawNeedle',
    afterDatasetsDraw: (chart: any) => {
      if (chart.canvas.id === 'chart') {
        const { width } = chart;
        const { ctx } = chart;
        const centerX = width / 2;
        const centerY = chart._metasets[0].data[0].y;
  
        const angle = ((this.currentRate / 100) * Math.PI) - (Math.PI / 2);
  
        ctx.save();
        ctx.translate(centerX, centerY);
        ctx.rotate(angle);
  
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(-3, -centerY * 0.5); 
        ctx.lineTo(-6, -centerY * 0.55); 
        ctx.lineTo(0, -centerY * 0.65);
        ctx.lineTo(6, -centerY * 0.55); 
        ctx.lineTo(3, -centerY * 0.5); 
        ctx.closePath();
  

        const gradient = ctx.createLinearGradient(0, 0, 0, -centerY * 0.65); 
        gradient.addColorStop(0, '#B0B0B0');
        gradient.addColorStop(1, '#808080');
  
        ctx.fillStyle = gradient;
        ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
        ctx.shadowBlur = 5;
        ctx.shadowOffsetX = 2;
        ctx.shadowOffsetY = 2;
        ctx.fill();
        ctx.restore();
  
        ctx.beginPath();
        ctx.arc(centerX, centerY, 10, 0, Math.PI * 2);
        ctx.fillStyle = '#444';

        ctx.fill();
        ctx.restore();
  

        ctx.save();
        ctx.font = '24px Arial';
        ctx.fillStyle = '#000';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(`${Math.round(this.currentRate)} %`, centerX, centerY - 50);
        ctx.restore();
      }
    }
  };
  
  ngAfterViewInit(): void {
    Chart.register(this.drawNeedlePlugin);
    this.createChart();
  }

  ngOnDestroy(): void {
    Chart.unregister(this.drawNeedlePlugin);
  }

  createChart(): void {
    const canvasId = 'chart';
    const ctx = (document.getElementById(canvasId) as HTMLCanvasElement).getContext('2d');
    if (ctx) {
      const gradient = ctx.createLinearGradient(0, 0, 500, 0);
      gradient.addColorStop(0, 'red');
      gradient.addColorStop(0.5, 'yellow');
      gradient.addColorStop(1, 'green');

      new Chart(ctx, {
        type: 'doughnut',
        data: {
          labels: ['Low', 'Medium', 'High'],
          datasets: [
            {
              data: [20, 20, 20, 20, 20],
              backgroundColor: [gradient, gradient, gradient, gradient, gradient],
              borderWidth: 3
            }
          ]
        },
        options: {
          responsive: true,
          cutout: '70%',
          rotation: -90,
          circumference: 180,
          plugins: {
            legend: {
              display: false
            },
            tooltip: {
              enabled: false
            }
          }
        }
      });
    }
  }

  animateNeedle(): void {
    const duration = 600; 
    const frameRate = 60; 
    const totalFrames = (duration / 1000) * frameRate;
    const increment = (this.conversionRate - this.currentRate) / totalFrames;

    const animate = () => {
      if (this.currentRate < this.conversionRate) {
        this.currentRate = Math.min(this.currentRate + increment, this.conversionRate);
        requestAnimationFrame(animate);
      }
    };

    animate();
  }
}
