import { Injectable } from '@angular/core';
import { TRANSLATION } from './translation.dictionary';

@Injectable({
  providedIn: 'root'
})
export class TranslationService {
   // Tipagem explícita para o dicionário
  private translation: { [key: string]: string } = TRANSLATION;

  constructor() { }

  translate(key: string): string {
    // Retorna a tradução se existir, senão retorna a própria chave
    return this.translation[key] ?? key;
  }
}
