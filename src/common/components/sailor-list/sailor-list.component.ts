import { CommonModule } from "@angular/common";
import { HttpClient } from "@angular/common/http";
import { Component, EventEmitter, Input, Output } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { Officer } from "src/common/common.types";

@Component({
  selector: "sailor-list",
  templateUrl: "./sailor-list.component.html",
  imports: [CommonModule, MatCardModule, MatButtonModule],
  styleUrls: ["./sailor-list.component.css"]
})
export class SailorListComponent {
  @Input() sailors: Officer[] = [];
  @Input() classTitle: string | undefined = "";

  @Output() addSailor = new EventEmitter();

  constructor(private http: HttpClient){}

  protected addNewSailor() {
    this.addSailor.emit();
  }
}
