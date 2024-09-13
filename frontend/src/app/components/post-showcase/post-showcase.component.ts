
import { Component, Inject } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UserService } from 'src/app/services/user/user.service';

@Component({
  selector: 'app-post-showcase',
  templateUrl: './post-showcase.component.html',
  styleUrls: ['./post-showcase.component.scss']
})
export class PostShowcaseComponent {
  imageList: any;
  userInfo: any;

  constructor(
    @Inject(MAT_DIALOG_DATA) public postData: any,
    public dialogRef: MatDialogRef<[PostShowcaseComponent]>,
    private userSvc: UserService
  ) {
    this.dialogRef.updateSize('700px', 'auto');
    if (this.postData) {
      this.imageList = this.postData.img;
    }
  }

  async loadUserData() {
    try {
      this.userInfo = await this.userSvc.getUserInfo(this.postData.created_user_id);
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  }
}
