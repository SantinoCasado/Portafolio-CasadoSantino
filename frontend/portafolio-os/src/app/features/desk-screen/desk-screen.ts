import { Component } from '@angular/core';
import { LanguageService } from '../../services/language.service';
import { TaskBar } from '../../layouts/task-bar/task-bar';

@Component({
  selector: 'app-desk-screen',
  imports: [TaskBar],
  templateUrl: './desk-screen.html',
  styleUrl: './desk-screen.css',
})
export class DeskScreen {}
