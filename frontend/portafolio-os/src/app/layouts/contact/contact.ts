import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // <-- NECESARIO PARA LOS INPUTS
import { CdkDrag, CdkDragHandle } from '@angular/cdk/drag-drop';
import { LanguageService } from '../../services/language.service';
import { AttachedFile } from './interfaces/attachedFile';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, FormsModule, CdkDrag, CdkDragHandle],
  templateUrl: './contact.html',
  styleUrl: './contact.css'
})
export class Contact {
  @Output() minimize = new EventEmitter<void>();
  @Output() close = new EventEmitter<void>();

  isMaximized = false;

  myEmail = 'santinocasado05@gmail.com'; 

  // Lista de archivos adjuntos por el usuario
  attachedFiles: AttachedFile[] = [];

  // Variables vinculadas al HTML
  subject = '';
  body = '';

  constructor(public langService: LanguageService) {}

  // Dispara el selector de archivos nativo de la PC del usuario
  triggerFileInput(fileInput: HTMLInputElement) {
    fileInput.click();
  }

  // Captura el archivo seleccionado y lo agrega a la lista visual
  onFilesSelected(event: any) {
    const files: FileList = event.target.files;
    if (files) {
      for (let i = 0; i < files.length; i++) {
        const file = files.item(i);
        if (file) {
          // Formateamos el tamaño en KB o MB
          const sizeKb = file.size / 1024;
          const formattedSize = sizeKb > 1024 
            ? `${(sizeKb / 1024).toFixed(1)} MB` 
            : `${sizeKb.toFixed(1)} KB`;

          this.attachedFiles.push({
            name: file.name,
            size: formattedSize,
            fileObject: file
          });
        }
      }
    }
    // Resetea el input para permitir elegir el mismo archivo de nuevo si se desea
    event.target.value = '';
  }

  // Eliminar un archivo adjunto de la lista
  removeAttachment(index: number) {
    this.attachedFiles.splice(index, 1);
  }

  sendEmail() {
    // Nota en el cuerpo si hay archivos adjuntos avisando al reclutador
    let finalBody = this.body;
    if (this.attachedFiles.length > 0) {
      const fileNames = this.attachedFiles.map(f => f.name).join(', ');
      const noteEs = `\n\n[Nota del sistema: El usuario adjuntó los siguientes archivos: ${fileNames}. Recuerde adjuntarlos manualmente en este correo si es necesario].`;
      const noteEn = `\n\n[System Note: The user attached the following files: ${fileNames}. Remember to attach them manually to this email if needed].`;
      
      finalBody += this.langService.currentLang() === 'es' ? noteEs : noteEn;
    }

    const encodedSubject = encodeURIComponent(this.subject);
    const encodedBody = encodeURIComponent(finalBody);

    const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${this.myEmail}&su=${encodedSubject}&body=${encodedBody}`;
    
    // Abre Gmail
    window.open(gmailUrl, '_blank');

    //los archivos también se descarguen a su PC para que los tenga listos para arrastrar a Gmail:
    this.attachedFiles.forEach(att => {
      const url = URL.createObjectURL(att.fileObject);
      const a = document.createElement('a');
      a.href = url;
      a.download = att.name;
      a.click();
      URL.revokeObjectURL(url);
    });
  }

  onMinimize() { this.minimize.emit(); }
  onClose() { this.close.emit(); }
  toggleMaximize() { this.isMaximized = !this.isMaximized; }

}