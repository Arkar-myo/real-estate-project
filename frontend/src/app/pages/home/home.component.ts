import { Component,  } from '@angular/core';
import { HomeService } from 'src/app/services/home/home.service';
import { MatDialog } from '@angular/material/dialog';
import { PostComponentComponent } from 'src/app/components/post-component/post-component.component';
import { PostShowcaseComponent } from 'src/app/components/post-showcase/post-showcase.component';
import { LoadingService } from 'src/app/services/loading/loading.service';
import { ConfirmDialogComponent } from 'src/app/components/confirmDialog/confirm-dialog.component';
import { PostService } from 'src/app/services/post/post.service';
import { ErrorDialogComponent } from 'src/app/components/errorDialog/error-dialog.component';
import { FormBuilder, FormGroup } from '@angular/forms';


// import {NestedTreeControl} from '@angular/cdk/tree';
// import {MatTreeNestedDataSource} from '@angular/material/tree';
// import {MatTreeModule} from '@angular/material/tree';

// import {SelectionModel} from '@angular/cdk/collections';
// import {FlatTreeControl} from '@angular/cdk/tree';
import { AppConstants } from 'src/app/constants';

interface CityNode {
  name: string;
  children?: CityNode[];
}

const CITY_DATA: CityNode[] = [
  {
    name: 'Fruit',
    children: [{name: 'Apple'}, {name: 'Banana'}, {name: 'Fruit loops'}],
  },
  {
    name: 'Fruits',
    children: [{name: 'pineapple'}, {name: 'grape'}, {name: 'Berry'}],
  },
  
];


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  regions = AppConstants.CITY_DATA;
  cities:any = [];

  // cityNames = [
  //   {name: 'ရန်ကုန်'},
  //   {name: 'မကွေး'},
  //   {name: 'မန္တလေး'},
  //   {name: 'မိတ္ထီလာ'},
  //   {name: 'စစ်ကိုင်း'}
  // ]

  postType = [
    {name: 'ခြံဝန်း'},
    {name: 'အိမ် + ခြံ'},
    {name: 'ကွန်ဒို'},
  ]
  
  // treeControl = new NestedTreeControl<CityNode>(node => node.children);
  // dataSource = new MatTreeNestedDataSource<CityNode>();
  searchForm: FormGroup;
  postList: any[] = [];
  userData: any = localStorage.getItem('user');
  userObj = JSON.parse(this.userData);
  isCityOpen = false;

  constructor(
    private homeSvc: HomeService,
    private formBuilder: FormBuilder,
    private dialog: MatDialog,
    private loadingSvc: LoadingService,
    private postSvc: PostService,

    
  ) {
    this.regions.forEach((region:any)=> {
      region.children.forEach((city:any)=> {
        this.cities.push(city);
      })
    });
    // this.dataSource.data = CITY_DATA;
    this.searchForm = this.formBuilder.group({
      city: [''],
      type: ['']
    });
    this.loadingSvc.showLoading();

    this.fetchData();
  }
  hasChild = (_: number, node: CityNode) => !!node.children && node.children.length > 0;
  fetchData(): void {
    this.homeSvc.getPostList().subscribe({
      next: (response) => {
        this.loadingSvc.hideLoading();
        
        this.postList = response;
        // response.forEach((item:any)=> {
        //   item.img = JSON.parse(item.img);
        // });
      },
      error: (error) => {
        console.error(error);
      }
    });
  }

  checkUser(): boolean {
    if (this.userObj.type === 2) {
      return false;
    }
    return true;
  }

  checkProperty(ownerId: number): boolean {
    if (this.userObj.type === 0 || this.userObj.id === ownerId) {
      return true
    }
    return false
  }

  showPostDialog(postData: any = null): void {
    if (this.userObj.type === 2) {
      return;
    } else {
      this.dialog.open(PostShowcaseComponent, {
        data: postData
      });

    }
  }

  editPost(postData: any = null): void {
    if (this.userObj.type === 2) {
      return;
    } else {
      const dialogRef = this.dialog.open(PostComponentComponent, {
        data: postData
      });

      dialogRef.afterClosed().subscribe(result => {
        this.fetchData();
      });
    }
  }

  deletePost(postId: number): void {
    if (this.userObj.type === 2) {
      return;
    } else {
      const dialogRef = this.dialog.open(ConfirmDialogComponent, {
        data: 'Are you sure?'
      });

      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.postSvc.deletePost(postId).subscribe({
            next: (response) => {
              this.fetchData();
            },
            error: (error) => {
              console.error(error);
              this.dialog.open(ErrorDialogComponent, {
                data: { errorMessage: 'Cannot delete post.' }
              });
            }
          });
        } else {
          return;
        }
      });
    }
  }

  onSearchPost(): void {
    if(!this.searchForm.value.city && !this.searchForm.value.type){
      this.fetchData();
    }
    if (this.searchForm.valid && this.searchForm.value.city || this.searchForm.value.type) {
      this.postSvc.searchPost(this.searchForm.value).subscribe({
        next: (response) => {
          this.postList = response;
        },
        error: (error) => {
          this.postList = [];
          console.error(error);
        }
      });
    }

  }

  clearInput():any {
    this.fetchData();
    this.searchForm.patchValue({
      searchInput: ''
    })
  }

  onCancle(): any {
    this.searchForm.patchValue({
      type: '',
      city: '',
    });
    this.fetchData();
  }
}
