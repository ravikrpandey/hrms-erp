import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { Chart, ChartConfiguration, registerables } from 'chart.js';
import { FunnelController, TrapezoidElement } from 'chartjs-chart-funnel';
import { RecruitService } from 'src/app/@shared/services/recruitment.service';

Chart.register(...registerables, FunnelController, TrapezoidElement);

@Component({
  selector: 'app-candidate-pipeline-funnel',
  templateUrl: './candidate-pipeline-funnel.component.html',
  styleUrls: ['./candidate-pipeline-funnel.component.scss']
})
export class CandidatePipelineFunnelComponent implements OnInit {
  @Input() fromMonth!: number;
  @Input() toMonth!: number;
  mainEmpId: string | null;
  entityId: string | null;
  financialYear_id: string | null;
  recruitmentFunnelData: any;
  funnelChart: Chart<'funnel'> | null = null;

  constructor(private dashboardService: RecruitService) {}

  ngOnInit(): void {
    this.mainEmpId = localStorage.getItem('EmpMainId');
    this.entityId = localStorage.getItem('selectedEntityId');
    this.financialYear_id = localStorage.getItem('financial_id');

    this.getRecruitmentPipelineFunnelData();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['fromMonth'] || changes['toMonth']) {
      this.getRecruitmentPipelineFunnelData();
    }
  }
  getRecruitmentPipelineFunnelData() {
    const data = {
      fromMonth: this.fromMonth,
      toMonth: this.toMonth,
      financial_id: this.financialYear_id,
    };

    this.dashboardService
      .getRecruitmentPipelineFunnel(this.mainEmpId, this.entityId, data)
      .subscribe((res: any) => {
        this.recruitmentFunnelData = res.data;

        this.updateFunnelChart([
          this.recruitmentFunnelData.totalApplied,
          this.recruitmentFunnelData.totalScreened,
          this.recruitmentFunnelData.totalInterviewed,
          this.recruitmentFunnelData.totalOffered,
          this.recruitmentFunnelData.totalHired,
        ]);
      });
  }

  updateFunnelChart(data: number[]) {
    const ctx = document.getElementById('funnelChart') as HTMLCanvasElement;

    if (this.funnelChart) {
      this.funnelChart.data.datasets[0].data = data;
      this.funnelChart.update();
    } else {
      this.funnelChart = new Chart(ctx, {
        type: 'funnel',
        data: {
          labels: ['Applied', 'Screened', 'Interviewed', 'Offered', 'Hired'],
          datasets: [
            {
              data,
              backgroundColor: [
                '#1d46b6',
                '#3b62ce',
                '#4e71cf',
                '#6284e2',
                '#2592db',
              ],
              borderColor: '#ffffff',
              borderWidth: 2,
              hoverBackgroundColor: [
                '#3d1dce',
                '#24335e',
                '#1049e7',
                '#269b97',
                '#014a8f',
              ],
            },
          ],
        },
        options: {
          indexAxis: 'y',
          maintainAspectRatio: false,
          responsive: true,
          plugins: {
            legend: {
              display: false,
            },
            tooltip: {
              callbacks: {
                label: (context) => {
                  const label = context.label || '';
                  const value = context.raw || 0;
                  return `${label}: ${value} candidates`;
                },
              },
              backgroundColor: '#333',
              titleColor: '#fff',
              bodyColor: '#fff',
            },
          },
          layout: {
            padding: {
              top: 20,
              bottom: 20,
            },
          },
        },
        plugins: [
          {
            id: 'centerLabels',
            afterDatasetDraw: (chart) => {
              const { ctx } = chart;
              const dataset = chart.data.datasets[0];
              const meta = chart.getDatasetMeta(0);

              ctx.save();
              ctx.font = '16px Arial';
              ctx.fillStyle = '#fff';
              ctx.textAlign = 'center';
              ctx.textBaseline = 'middle';

              meta.data.forEach((dataPoint, index) => {
                const { x, y } = dataPoint.tooltipPosition(true); 
                const label = chart.data.labels![index];
                const value = dataset.data[index] as number;

                ctx.fillText(`${label}`, x, y - 10); 
                ctx.fillText(`${value}`, x, y + 10); 
              });

              ctx.restore();
            },
          },
        ],
      });
    }
  }
}
