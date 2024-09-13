import { Component, Inject } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { PostService } from 'src/app/services/post/post.service';
import { MatDialog } from '@angular/material/dialog';
import { ErrorDialogComponent } from '../errorDialog/error-dialog.component';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NestedTreeControl } from '@angular/cdk/tree';
import { MatTreeNestedDataSource } from '@angular/material/tree';
import { CityComponentComponent } from '../city-component/city-component.component';
import { AppConstants } from 'src/app/constants';

interface CityNode {
  name: string;
  children?: CityNode[];
}

// const CITY_DATA: CityNode[] = [
//   {
//     // တိုင်း/ပြည်နယ်
//     name: 'ရန်ကုန်တိုင်း',
//     children: [{name: 'ရန်ကုန်'}, {name: 'Banana'}, {name: 'Fruit loops'}],
//   },
//   {
//     name: 'မန္တလေးတိုင်း',
//     children: [{name: 'မန္တလေး'}, {name: 'မိတ္ထီလာ'}, {name: 'Berry'}],
//   },

// ];

@Component({
  selector: 'app-post-component',
  templateUrl: './post-component.component.html',
  styleUrls: ['./post-component.component.scss']
})
export class PostComponentComponent {
  treeControl = new NestedTreeControl<CityNode>(node => node.children);
  dataSource = new MatTreeNestedDataSource<CityNode>();
  postForm: FormGroup;
  regionName = '';
  cities: any = [{ name: 'Apple' }, { name: 'Banana' }, { name: 'Fruit loops' }];
  cityData = AppConstants.CITY_DATA;
  selectedImage: string | null = null;
  isCityOpen = false;
  userData: any = localStorage.getItem('user');
  userObj = JSON.parse(this.userData);
  imageList: any = [];
  imagePath: string = 'assets/33/0.png'



  postType = [
    { name: 'ခြံဝန်း' },
    { name: 'အိမ် + ခြံ' },
    { name: 'ကွန်ဒို' },
  ]


  constructor(
    @Inject(MAT_DIALOG_DATA) public postData: any,
    public dialogRef: MatDialogRef<[PostComponentComponent]>,
    private formBuilder: FormBuilder,
    private postSvc: PostService,
    private dialog: MatDialog,

  ) {
    dialogRef.updateSize('800px', 'auto');
    this.postForm = this.formBuilder.group({
      title: ['', [Validators.required]],
      soldOut: [false,],
      verified: [false,],
      gran: [false,],
      description: ['', Validators.required],
      price: ['', Validators.required],
      city: [''],
      location: ['', Validators.required],
      phone: ['', Validators.required],
      img: ['']
    });
    if (this.postData) {
      this.postForm.patchValue({
        title: this.postData.title,
        soldOut: this.postData.soldOut,
        verified: this.postData.verified,
        gran: this.postData.gran,
        description: this.postData.description,
        price: this.postData.price,
        city: this.postData.city,
        location: this.postData.location,
        phone: this.postData.phone,
        img: this.postData.img
      });
      this.imageList = this.postData.img;
      this.selectedImage = this.postData.img;
      this.cityData.forEach((region: any) => {
        region.children?.forEach((city: any) => {
          if (city.name === this.postData.city) {
            this.regionName = region.name;
            this.cities = region.children;
          }
        })
      })
    }
  }
  hasChild = (_: number, node: CityNode) => !!node.children && node.children.length > 0;


  onCancel(): void {
    this.dialogRef.close(); // Close the dialog without creating a post
  }

  onCreatePost(): void {
    if (this.postForm.valid) {
      this.postSvc.createPost(this.postForm.value).subscribe({
        next: (response) => {
          this.dialogRef.close();
        },
        error: (error) => {
          console.error(error);
          this.dialogRef.close();
          this.dialog.open(ErrorDialogComponent, {
            data: { errorMessage: 'Cannot create post.' }
          });
        }
      });
    }
  }
  updatePost(): void {
    if (this.postForm.valid) {
      this.postSvc.updatePost(this.postForm.value, this.postData.id).subscribe({
        next: (response) => {
          this.dialogRef.close();
        },
        error: (error) => {
          console.error(error);
          this.dialogRef.close();
          this.dialog.open(ErrorDialogComponent, {
            data: { errorMessage: 'Cannot create post.' }
          });
        }
      });
    }

  }

  onImageChange(event: any): void {
    const files: FileList = event.target.files;
    if (files.length > 0) {
      const file: File = files.item(0) as File;
      const fileName = file?.name;
      const fileExtension = fileName?.split('.').pop()?.toLowerCase();

      // Check if the file extension is 'jpg' or 'png'
      if (fileExtension === 'jpg' || fileExtension === 'jpeg' || fileExtension === 'png') {
        const fileReader = new FileReader();
        fileReader.onload = () => {
          // Use the result property of the FileReader to get the Base64 representation
          this.selectedImage = fileReader.result as string;

          this.imageList.push(fileReader.result as string)
          this.postForm.value.img = this.imageList;
        };
        fileReader.readAsDataURL(file);
      } else {
        this.dialog.open(ErrorDialogComponent, {
          data: { errorMessage: 'Invalid file type. Please select a JPG or PNG image.' }
        });
        this.selectedImage = null;
      }
    } else {
      this.selectedImage = null;
    }
  }

  onClickRegion(region: any) {
    this.cities = region.children;
  }

  removeImg(index: number) {
    this.imageList.splice(index, 1);
  }
}
