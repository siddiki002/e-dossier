import { CommonModule } from "@angular/common";
import { HttpClient } from "@angular/common/http";
import { Component, EventEmitter, Input, Output, OnInit, OnDestroy, SimpleChange, SimpleChanges } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { Officer } from "src/common/common.types";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { FormsModule } from "@angular/forms";
import { Subject } from "rxjs";
import { debounceTime, distinctUntilChanged, takeUntil } from "rxjs/operators";

@Component({
  selector: "sailor-list",
  templateUrl: "./sailor-list.component.html",
  imports: [CommonModule, MatCardModule, MatButtonModule, MatIconModule, MatInputModule, FormsModule],
  styleUrls: ["./sailor-list.component.css"]
})
export class SailorListComponent implements OnInit, OnDestroy {
  @Input() sailors: Officer[] = [];
  @Input() classTitle: string | undefined = "";
  @Input() showSearchBar: boolean = false;
  @Input() allowSailorSelection: boolean = false;
  @Input() allowAddSailor: boolean = false;

  @Output() addSailor = new EventEmitter();
  @Output() onSailorSelection = new EventEmitter<Officer>();

  protected searchTerm: string = "";
  private searchSubject = new Subject<string>();
  private destroy$ = new Subject<void>();
  protected selectedOfficerId: string = "";

  constructor(private http: HttpClient){}

  ngOnInit() {
    this.searchSubject
      .pipe(
        debounceTime(50),
        distinctUntilChanged(),
        takeUntil(this.destroy$)
      )
      .subscribe((term) => {
        this.performSearch(term);
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  protected selectSailor(sailor: Officer) {
    this.selectedOfficerId = sailor.id;
    this.onSailorSelection.emit(sailor);
  }

  protected onSearch(term: string) {
    this.searchTerm = term;
    this.searchSubject.next(term);
  }

  private performSearch(term: string) {}

  protected get sailorList(): Officer[] {
    if (!this.searchTerm) {
      return this.sailors;
    }

    const lowerTerm = this.searchTerm.toLowerCase();

    const sailorsWithSameId = this.sailors.filter(sailor =>
      sailor.officerId.toLowerCase().includes(lowerTerm));

    const sailorsWithSameName = this.sailors.filter(sailor =>
      sailor.name.toLowerCase().includes(lowerTerm));

    return [...sailorsWithSameId, ...sailorsWithSameName];
  }

  protected addNewSailor() {
    this.addSailor.emit();
  }
}
