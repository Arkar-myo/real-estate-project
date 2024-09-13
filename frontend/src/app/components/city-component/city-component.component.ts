import { Component, Inject } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

import { NestedTreeControl } from '@angular/cdk/tree';
import { MatTreeNestedDataSource } from '@angular/material/tree';
import { FormBuilder, FormGroup } from '@angular/forms';

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
  selector: 'app-city-component',
  templateUrl: './city-component.component.html',
  styleUrls: ['./city-component.component.scss']
})
export class CityComponentComponent {
  treeControl = new NestedTreeControl<CityNode>(node => node.children);
  dataSource = new MatTreeNestedDataSource<CityNode>();
  cityForm: FormGroup;


  constructor(
    // @Inject(MAT_DIALOG_DATA) public postData: any,
    public dialogRef: MatDialogRef<[CityComponentComponent]>,
    private formBuilder: FormBuilder,
    // private postSvc: PostService,
    ) {
    // dialogRef.updateSize('1200px', 'auto');
    this.cityForm = this.formBuilder.group({
      city: [''],
      
    });
    
  }
  hasChild = (_: number, node: CityNode) => !!node.children && node.children.length > 0;

  

}
