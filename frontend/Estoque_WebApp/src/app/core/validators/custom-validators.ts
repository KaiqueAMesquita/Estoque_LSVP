import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

/**
 * Validador que verifica se o campo contém apenas letras e espaços.
 */
export function onlyLettersAndSpacesValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (control.value && !/^[A-Za-zÀ-ÿ\s]+$/.test(control.value)) {
      return { onlyLettersAndSpaces: true }; // Inválido
    }
    return null; // Válido
  };
}

/**
 * Validador que verifica se o campo contém apenas números.
 */
export function onlyNumbersValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (control.value && !/^\d+$/.test(control.value)) {
      return { onlyNumbers: true }; // Inválido
    }
    return null; // Válido
  };
}

/**
 * Validador que verifica se o campo tem exatamente um número de dígitos.
 */
export function exactLengthValidator(length: number): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (control.value && control.value.length !== length) {
      return { exactLength: { requiredLength: length, actualLength: control.value.length } };
    }
    return null;
  };
}
