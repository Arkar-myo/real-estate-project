import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { TransactionService } from 'src/app/services/transaction/transaction.service';
import { ErrorDialogComponent } from '../errorDialog/error-dialog.component';
import { LoadingService } from 'src/app/services/loading/loading.service';
import { UtilService } from 'src/app/services/util.service';

@Component({
  selector: 'app-premium-buy',
  templateUrl: './premium-buy.component.html',
  styleUrls: ['./premium-buy.component.scss']
})
export class PremiumBuyComponent {
  transacForm: FormGroup;



  constructor(
    public dialogRef: MatDialogRef<[PremiumBuyComponent]>,
    private formBuilder: FormBuilder,
    private dialog: MatDialog,
    private transacSvc: TransactionService,
    private loadingSvc: LoadingService,
    private utilService: UtilService
  ) {
    dialogRef.updateSize('800px', 'auto');
    this.transacForm = this.formBuilder.group({
      transactionId: ['', [Validators.required, this.utilService.validateTransactionId]],
      payAmount: ['', [Validators.required]],
      phone: ['', [Validators.required, this.utilService.phoneValidator()]],
      accName: ['', [Validators.required]],
    });
  }

  onSubmitTrans(): void {
    if (this.transacForm.valid) {
      this.loadingSvc.showLoading();
      this.transacSvc.createTransaction(this.transacForm.value).subscribe({
        next: (response) => {
          this.loadingSvc.hideLoading();
          this.dialogRef.close();
        },
        error: (error) => {
          this.loadingSvc.hideLoading();
          console.error(error);
          this.dialogRef.close();
          this.dialog.open(ErrorDialogComponent, {
            data: { errorMessage: 'Cannot submit the transaction.' }
          });
        }
      });
    }

  }
}
