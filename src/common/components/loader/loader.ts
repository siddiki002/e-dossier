import { Component } from '@angular/core';
import { LoaderService } from 'src/common/service/loader.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';


@Component({
	imports: [MatProgressSpinnerModule, CommonModule],
	selector: 'app-loader',
	templateUrl: './loader.html',
	styleUrls: ['./loader.css']
})
export class LoaderComponent {
  protected loading$: Observable<boolean>
  constructor(private loaderService: LoaderService) {
    this.loading$ = this.loaderService.loading$;
  }
}
