# Página de Vendas Minimalista

Uma página de vendas simples e elegante para exibir produtos com múltiplas imagens e integração direta com WhatsApp.

## ✨ Funcionalidades

### 🖼️ **Galeria de Imagens**
- **Múltiplas imagens por produto** - Adicione quantas fotos quiser
- **Visualização em lightbox** - Clique nas imagens para ver em tamanho grande
- **Navegação entre imagens** - Use as setas ou teclado para navegar
- **Thumbnails clicáveis** - Acesso direto a qualquer imagem
- **Contador de imagens** - Mostra posição atual (ex: "2 / 5")

### 🛒 **Gerenciamento de Produtos**
- **Modo administrador** - Interface para gerenciar produtos
- **Adicionar/editar produtos** - Nome, preço, descrição e múltiplas imagens
- **Upload de imagens** - Por arquivo local ou URL
- **Preview em tempo real** - Veja as imagens antes de salvar
- **Remoção individual** - Remova imagens específicas facilmente

### 📱 **Integração WhatsApp**
- **Botão direto** - Cada produto tem seu botão personalizado
- **Mensagem pré-formatada** - Inclui nome e preço do produto
- **Link automático** - Abre WhatsApp Web ou app automaticamente

### 🎨 **Design Responsivo**
- **Mobile-first** - Funciona perfeitamente em celulares
- **Tablet e desktop** - Adapta-se a qualquer tamanho de tela
- **Lightbox responsivo** - Navegação otimizada para touch
- **Galeria adaptável** - Thumbnails se ajustam ao espaço disponível

### 🔒 **Autenticação e Segurança**
- **Login obrigatório** - Acesso ao modo admin protegido por usuário e senha
- **Sessão temporária** - Logout automático ao sair do modo admin
- **Validação de credenciais** - Mensagens de erro para tentativas inválidas
- **Interface segura** - Campos de senha mascarados e formulário responsivo

### 💾 **Persistência de Dados**
- **Armazenamento local** - Dados salvos no navegador
- **Imagens em Base64** - Não dependem de servidores externos
- **Backup/restauração** - Exporte e importe seus dados
- **Compatibilidade** - Funciona offline após carregamento inicial

## 🚀 Como Usar

### Para Usuários Finais
1. **Visualizar produtos** - Navegue pelos produtos disponíveis
2. **Ver imagens** - Clique em qualquer imagem para abrir o lightbox
3. **Navegar galeria** - Use as setas ← → ou teclado para navegar
4. **Comprar** - Clique no botão WhatsApp para entrar em contato

### Para Administradores
1. **Acessar modo admin** - Clique no botão "Modo Admin"
2. **Fazer login** - Use as credenciais de administrador:
   - **Usuário**: `admin`
   - **Senha**: `admin123`
3. **Adicionar produto** - Clique em "Adicionar Produto"
4. **Preencher dados** - Nome, preço e descrição
5. **Adicionar imagens**:
   - **Por arquivo**: Clique em "Choose Files" e selecione múltiplas imagens
   - **Por URL**: Cole a URL da imagem e clique "Adicionar URL"
6. **Gerenciar imagens** - Clique no X vermelho para remover imagens
7. **Salvar produto** - Clique em "Salvar Produto"
8. **Sair do admin** - Clique em "Sair do Admin" para fazer logout

### Navegação no Lightbox
- **Abrir**: Clique em qualquer imagem do produto
- **Navegar**: Use as setas ← → ou teclas do teclado
- **Fechar**: Clique no X, pressione ESC ou clique fora da imagem
- **Contador**: Veja a posição atual (ex: "3 / 7")

## 🎯 Recursos Técnicos

### Tecnologias Utilizadas
- **HTML5** - Estrutura semântica e acessível
- **CSS3** - Estilos modernos com Flexbox e Grid
- **JavaScript ES6+** - Funcionalidades interativas
- **LocalStorage** - Persistência de dados no navegador
- **Base64** - Codificação de imagens para persistência

### Compatibilidade
- **Navegadores modernos** - Chrome, Firefox, Safari, Edge
- **Dispositivos móveis** - iOS Safari, Chrome Mobile
- **Funciona offline** - Após carregamento inicial
- **Sem dependências** - Não requer bibliotecas externas

### Estrutura de Arquivos
```
pagina-vendas/
├── index.html          # Página principal
├── styles.css          # Estilos CSS
├── script.js           # Funcionalidades JavaScript
├── README.md           # Esta documentação
└── exemplo-dados.json  # Dados de exemplo
```

## 🔧 Personalização

### Textos Editáveis
- **Nome da loja** - Clique no título para editar
- **Descrição** - Clique na descrição para personalizar
- **Contato** - Edite as informações de contato no rodapé

### Cores e Estilo
- Edite o arquivo `styles.css` para personalizar:
  - Cores principais
  - Fontes
  - Espaçamentos
  - Efeitos visuais

### Credenciais de Administrador
- **Credenciais padrão**:
  - Usuário: `admin`
  - Senha: `admin123`
- **Para alterar**: Edite as constantes no arquivo `script.js`:
  ```javascript
  const ADMIN_CREDENTIALS = {
      username: 'seu_usuario',
      password: 'sua_senha_segura'
  };
  ```
- **Recomendação**: Use senhas fortes em produção

### Funcionalidades Avançadas
- **Backup automático** - Exporte dados regularmente
- **Múltiplas lojas** - Use diferentes arquivos para diferentes negócios
- **Integração** - Adicione analytics ou outras ferramentas

## 📋 Formato dos Dados

### Estrutura do Produto
```json
{
  "id": "produto-123",
  "name": "Nome do Produto",
  "price": "R$ 99,90",
  "description": "Descrição detalhada",
  "images": [
    "data:image/jpeg;base64,/9j/4AAQ...",
    "https://exemplo.com/imagem.jpg"
  ],
  "image": "data:image/jpeg;base64,/9j/4AAQ..."
}
```

**Campos:**
- `id`: Identificador único do produto
- `name`: Nome do produto (obrigatório)
- `price`: Preço formatado (obrigatório)
- `description`: Descrição opcional
- `images`: Array com múltiplas imagens (URLs ou Base64)
- `image`: Primeira imagem (compatibilidade com versão anterior)

## 🚀 Deploy

### Hospedagem Simples
1. **Upload dos arquivos** - Envie todos os arquivos para seu servidor
2. **Configurar domínio** - Aponte seu domínio para a pasta
3. **Testar funcionalidades** - Verifique se tudo funciona corretamente

### Hospedagem Gratuita
- **GitHub Pages** - Hospedagem gratuita para projetos estáticos
- **Netlify** - Deploy automático com domínio personalizado
- **Vercel** - Hospedagem rápida e confiável

### Otimizações
- **Compressão** - Ative gzip no servidor
- **Cache** - Configure cache para arquivos estáticos
- **CDN** - Use CDN para melhor performance global

## 🆘 Solução de Problemas

### Login e Autenticação
- **Não consigo fazer login**
  - Verifique se está usando as credenciais corretas: `admin` / `admin123`
  - Certifique-se de que não há espaços extras nos campos
  - Tente recarregar a página e tentar novamente

- **Modal de login não abre**
  - Verifique se há erros no console do navegador (F12)
  - Certifique-se de que o JavaScript está habilitado

### Imagens não aparecem após atualizar
- **Causa**: Imagens carregadas por arquivo local não persistem
- **Solução**: Use URLs de imagens ou a nova funcionalidade Base64

### Lightbox não abre
- **Verificar**: Console do navegador para erros JavaScript
- **Solução**: Certifique-se que o produto tem imagens válidas

### Dados perdidos
- **Prevenção**: Use a função "Exportar Dados" regularmente
- **Recuperação**: Importe o backup mais recente

### Performance lenta
- **Causa**: Muitas imagens grandes em Base64
- **Solução**: Use URLs de imagens otimizadas ou reduza o tamanho

## 📞 Suporte

Para dúvidas ou sugestões sobre esta página de vendas, você pode:
- Consultar esta documentação
- Verificar o arquivo `exemplo-dados.json` para referência
- Testar as funcionalidades no modo administrador

---

**Versão**: 3.0 - Sistema de Autenticação  
**Atualizado**: Janeiro 2025  
**Compatibilidade**: Navegadores modernos

### Credenciais Padrão
- **Usuário**: admin
- **Senha**: admin123

