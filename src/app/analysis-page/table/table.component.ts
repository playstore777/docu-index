import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css'],
})
export class TableComponent implements OnInit {
  data: any = [
    {
      fieldName: '1',
      pageNumber: '2',
      imgSrc: 'assets/images/first_snippet.png',
      docType: 'Consents',
      encounter: 'B00000123456',
      facility: 'SJHMC',
      isSelected: false,
    },
    {
      fieldName: '1',
      pageNumber: '1',
      imgSrc: 'assets/images/second_snippet.png',
      docType: 'Consents',
      encounter: 'B00000123456',
      facility: 'SJHMC',
      isSelected: false,
    },

  ];

  constructor() {}

  ngOnInit(): void {}

  actions(event:any) {
    const review = event.target.parentElement.parentElement.firstChild;
    const ignore = event.target.parentElement.parentElement.lastChild;

    review?.classList.toggle('review-active');
    ignore?.classList.toggle('ignore-active');
  }
}
