import { Component, inject, OnInit } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { DashboardSummary } from '../../models/dashboard.model';
import { DashboardService } from '../../core/services/dashboard.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  summary: DashboardSummary | null = null;
  isLoading = true;
  errorMessage = '';
  private readonly dashboardService = inject(DashboardService);

  ngOnInit(): void {
    this.dashboardService.getSummary().subscribe({
      next: (summary) => {
        this.summary = summary;
        this.isLoading = false;
      },
      error: (error: HttpErrorResponse) => {
        this.errorMessage = error.status === 0
          ? 'Unable to reach the inventory API. Check that the backend is running and allows CORS requests.'
          : `Unable to load inventory summary (HTTP ${error.status}).`;
        this.isLoading = false;
      }
    });
  }
}
