import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, FormControl } from '@angular/forms';
import { NavBarComponent } from '../../shared/components/nav-bar/nav-bar.component';
import { ManageLayoutComponent } from '../../shared/layouts/manage-layout/manage-layout.component';
import { InputComponent } from '../../shared/components/input/input.component';
import { IconModule, icons } from '../../shared/modules/icon/icon.module';
import { ReportService } from '../../core/services/report.service';

interface SelectOption {
  label: string;
  value: any;
}

@Component({
  selector: 'app-report',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NavBarComponent,
    ManageLayoutComponent,
    InputComponent,
    IconModule
  ],
  templateUrl: './report.component.html',
  styleUrl: './report.component.css'
})
export class ReportComponent implements OnInit {
  icons = icons;
  
  locationOptions: SelectOption[] = [
    { label: 'Estoque Central', value: 'estoque' },
    { label: 'Cozinha', value: 'cozinha' }
  ];
  
  monthOptions: SelectOption[] = [];
  yearOptions: SelectOption[] = [];

  stockForm: FormGroup;
  sourceForm: FormGroup;
  expensesForm: FormGroup;
  donationsForm: FormGroup;

  loading: { [key: string]: boolean } = {
    stock: false,
    source: false,
    risk: false,
    expenses: false,
    donations: false,
    coverage: false
  };

  constructor(
    private fb: FormBuilder,
    private reportService: ReportService
  ) {
    const today = new Date();
    const currentMonth = today.getMonth() + 1; // 1-12
    const currentYear = today.getFullYear();

    this.stockForm = this.fb.group({
      location: ['estoque', Validators.required]
    });

    this.sourceForm = this.fb.group({
      month: [currentMonth, Validators.required],
      year: [currentYear, Validators.required]
    });

    this.expensesForm = this.fb.group({
      year: [currentYear, Validators.required]
    });

    this.donationsForm = this.fb.group({
      month: [currentMonth, Validators.required],
      year: [currentYear, Validators.required]
    });
  }

  ngOnInit(): void {
    this.generateDateOptions();
  }

  private generateDateOptions() {
    const months = [
      'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
      'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
    ];
    
    this.monthOptions = months.map((m, index) => ({
      label: m,
      value: index + 1
    }));

    const currentYear = new Date().getFullYear();
    for (let i = 0; i < 5; i++) {
      this.yearOptions.push({
        label: (currentYear - i).toString(),
        value: currentYear - i
      });
    }
  }

  getControl(form: FormGroup, name: string): FormControl {
    return form.get(name) as FormControl;
  }


  downloadStockReport() {
    if (this.stockForm.invalid) return;
    this.loading['stock'] = true;
    
    const location = this.stockForm.get('location')?.value;
    
    this.reportService.getStockReport(location).subscribe({
      next: (blob) => this.reportService.downloadFile(blob, `posicao_estoque_${location}.pdf`),
      error: (err) => console.error(err),
      complete: () => this.loading['stock'] = false
    });
  }

  downloadSourceReport() {
    if (this.sourceForm.invalid) return;
    this.loading['source'] = true;

    const { month, year } = this.sourceForm.value;

    this.reportService.getSourceReport(month, year).subscribe({
      next: (blob) => this.reportService.downloadFile(blob, `relatorio_origem_${month}_${year}.pdf`),
      error: (err) => console.error(err),
      complete: () => this.loading['source'] = false
    });
  }

  downloadRiskReport() {
    this.loading['risk'] = true;
    this.reportService.getRiskReport().subscribe({
      next: (blob) => this.reportService.downloadFile(blob, `relatorio_risco_vencimento.pdf`),
      error: (err) => console.error(err),
      complete: () => this.loading['risk'] = false
    });
  }

  downloadExpensesReport() {
    if (this.expensesForm.invalid) return;
    this.loading['expenses'] = true;

    const { year } = this.expensesForm.value;

    this.reportService.getExpensesReport(year).subscribe({
      next: (blob) => this.reportService.downloadFile(blob, `custos_mensais_${year}.pdf`),
      error: (err) => console.error(err),
      complete: () => this.loading['expenses'] = false
    });
  }

  downloadDonationsReport() {
    if (this.donationsForm.invalid) return;
    this.loading['donations'] = true;

    const { month, year } = this.donationsForm.value;

    this.reportService.getDonationsReport(month, year).subscribe({
      next: (blob) => this.reportService.downloadFile(blob, `extrato_doacoes_${month}_${year}.pdf`),
      error: (err) => console.error(err),
      complete: () => this.loading['donations'] = false
    });
  }

  downloadCoverageReport() {
    this.loading['coverage'] = true;
    this.reportService.getCoverageReport().subscribe({
      next: (blob) => this.reportService.downloadFile(blob, `relatorio_cobertura_estoque.pdf`),
      error: (err) => console.error(err),
      complete: () => this.loading['coverage'] = false
    });
  }
}