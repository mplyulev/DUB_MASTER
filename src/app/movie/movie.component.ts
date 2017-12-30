import { Component, OnInit } from '@angular/core';
import createProjectService from '../movie/createProject.service'
 
@Component({
  selector: 'app-movie',
  templateUrl: './movie.component.html',
  styles: [],
  
  
})
export class MovieComponent implements OnInit {

  constructor(private createProjectService: createProjectService) { }

  ngOnInit() {
      
  }

}
