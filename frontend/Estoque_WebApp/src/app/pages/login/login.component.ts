import { Component, OnInit,ViewChild,AfterViewInit } from '@angular/core';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule} from '@angular/forms'
import { AuthenticationService } from '../../core/authentication/authentication.service';
import { Router } from '@angular/router';
import { Validators } from '@angular/forms';
import { ModalModule } from '../../shared/modules/modal/modal.module';
import { ModalComponent } from '../../shared/components/modal/modal.component';

@Component({
  selector: 'app-login',
  imports: [FormsModule, ReactiveFormsModule, ModalModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit, AfterViewInit {
  //definição do formulário de login
  loginForm!: FormGroup;
  errorMessage: any;

  @ViewChild('exceptionLogin') exceptionLogin!: ModalComponent;
  
  constructor(private auth: AuthenticationService, 
    private formBuilder: FormBuilder,
    private router: Router){}


  ngAfterViewInit(): void {}

  ngOnInit(): void {
    //inicialização do formulário
    //criação do formulário com os campos necessários
    this.loginForm = this.formBuilder.group({
      name: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  //enviar o formulário
  submitForm(event: Event): void {
    event.preventDefault();//previne o comportamento padrão do formulário
    //verifica se o formulário é válido
    if (this.loginForm.invalid) return;

    //chama o serviço de autenticação para fazer o login
    this.auth.login(this.loginForm.value).subscribe({
      //se o login for bem-sucedido, armazena o token e redireciona para a página inicial
      next: (res: any) => {
        this.auth.setToken(res.token);
        this.router.navigate(['/']);
      },
      //se o login falhar, exibe a mensagem de erro
      error: (error) => {
        if(this.exceptionLogin){
        this.exceptionLogin.toggle();
        //retorna erro da response
          this.errorMessage = error?.error;
       
        
        this.loginForm.reset();
      }
    }
  });
}
  
  
}