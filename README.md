<a name="readme-top">Pt-br</a>

<br />

<h3 align="center">API de um banco de dados de usuárias de uma comunidade de tecnologia para mulheres </h3>

## Sobre O Projeto

<p>Bem vindo(a)! Esse é um pojeto de back-end. desenvolvido para um MVP de uma aplicação fullstack, a parte de back-end do projeto pode ser encontrada https://github.com/gabrielliosc/comunidade-tech/.
  
O MVP tinha como proposta criar uma arquitetura de 3 componentes interligados
<p>Um esquema da arquitetura final do MVP pode ser consultada abaixo</p>

![arquitetura drawio](https://github.com/user-attachments/assets/732b9d99-6208-4047-9b87-3e454fba3dce)

O objetivo desse componente (B) é desenvolver um API para cadastro de mulheres em um comunidade que promove a diversidade na tecnologia.</p>
<p>A API é divida da seguinte forma e possui sua documentação de utilização no swagger:</p>

<p align="right">(<a href="#readme-top">back to top</a>)</p>

### Built With

Node, TypeScript, Knex, Sqlite, Docker

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Instalação

1. Clone o repositório
   ```sh
   git clone https://github.com/gabrielliosc/comunidade-tech-api.git
   ```
2. Instale o docker em sua máquina
3. Com o docker crie a imagem do backend a partir do Dockerfile
   ```sh
   docker build . -t "backend"
   ```
4. Inicie a aplicação com o docker apontando para a porta correta
   ```sh
   docker run -p 3333:3333 backend
   ```
5. Acesse a aplicação na porta 3333
   ```sh
   http://0.0.0.0:3333/ 
   ```

## Contato

Gabrielli de Oliveira e Silva da Cruz- [Linkedin](https://www.linkedin.com/in/gabrielli-oliveira-cruz/) - gabrielli.osc@gmail.com

<p align="right">(<a href="#readme-top">back to top</a>)</p>
