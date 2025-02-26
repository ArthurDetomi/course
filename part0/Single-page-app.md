```mermaid
sequenceDiagram
    participant user
    participant browser
    participant server

    user->>browser: Navega para a rota https://studies.cs.helsinki.fi/exampleapp/spa
    browser->>server: GET https://studies.cs.helsinki.fi/exampleapp/spa
    activate server
    server-->>browser: HTML document (SPA shell)
    deactivate server
![alt text](image.png)
    browser->>server: GET https://studies.cs.helsinki.fi/exampleapp/main.css
    activate server
    server-->>browser: arquivo css
    deactivate server

    browser->>server: GET https://studies.cs.helsinki.fi/exampleapp/spa.js
    activate server
    server-->>browser: arquivo javascript
    deactivate server

    Note right of browser: O browser executa o código javascript para atualizar o array de notas

    browser->>server: GET https://studies.cs.helsinki.fi/exampleapp/data.json
    activate server
    server-->>browser: [{ "content": "HTML is easy", "date": "2023-1-1" }, ... ]
    deactivate server

    Note right of browser: O browser executa a função callback que irá atualizar a lista de notas na tela SPA
```
