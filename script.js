// Estado da aplicação
let products = [];
let isAdminMode = false;
let isAuthenticated = false; // Estado de autenticação
let editingProductId = null;
let currentProductImages = []; // Array para armazenar imagens do produto atual
let currentLightboxImages = []; // Array para imagens no lightbox
let currentLightboxIndex = 0; // Índice atual no lightbox

// Credenciais de administrador (em produção, use um sistema mais seguro)
const ADMIN_CREDENTIALS = {
    username: 'admin',
    password: 'admin123'
};

// Elementos DOM
const elements = {
    toggleAdmin: document.getElementById('toggleAdmin'),
    adminPanel: document.getElementById('adminPanel'),
    addProduct: document.getElementById('addProduct'),
    exportData: document.getElementById('exportData'),
    importData: document.getElementById('importData'),
    importBtn: document.getElementById('importBtn'),
    productsGrid: document.getElementById('productsGrid'),
    emptyState: document.getElementById('emptyState'),
    productModal: document.getElementById('productModal'),
    productForm: document.getElementById('productForm'),
    modalTitle: document.getElementById('modalTitle'),
    closeModal: document.getElementById('closeModal'),
    cancelBtn: document.getElementById('cancelBtn'),
    productName: document.getElementById('productName'),
    productPrice: document.getElementById('productPrice'),
    productDescription: document.getElementById('productDescription'),
    productImageFile: document.getElementById('productImageFile'),
    productImageUrl: document.getElementById('productImageUrl'),
    addImageUrl: document.getElementById('addImageUrl'),
    imagesPreview: document.getElementById('imagesPreview'),
    // Elementos do lightbox
    lightbox: document.getElementById('lightbox'),
    closeLightbox: document.getElementById('closeLightbox'),
    prevImage: document.getElementById('prevImage'),
    nextImage: document.getElementById('nextImage'),
    lightboxImage: document.getElementById('lightboxImage'),
    currentImageIndex: document.getElementById('currentImageIndex'),
    totalImages: document.getElementById('totalImages'),
    // Elementos do login
    loginModal: document.getElementById('loginModal'),
    loginForm: document.getElementById('loginForm'),
    closeLoginModal: document.getElementById('closeLoginModal'),
    cancelLoginBtn: document.getElementById('cancelLoginBtn'),
    adminUsername: document.getElementById('adminUsername'),
    adminPassword: document.getElementById('adminPassword'),
    loginError: document.getElementById('loginError')
};

// Inicialização
document.addEventListener('DOMContentLoaded', function() {
    loadProducts();
    renderProducts();
    setupEventListeners();
    setupContentEditable();
});

// Event Listeners
function setupEventListeners() {
    // Admin controls
    elements.toggleAdmin.addEventListener('click', toggleAdminMode);
    elements.addProduct.addEventListener('click', openAddProductModal);
    elements.exportData.addEventListener('click', exportData);
    elements.importBtn.addEventListener('click', () => elements.importData.click());
    elements.importData.addEventListener('change', importData);
    
    // Modal controls
    elements.closeModal.addEventListener('click', closeModal);
    elements.cancelBtn.addEventListener('click', closeModal);
    elements.productForm.addEventListener('submit', saveProduct);
    
    // Multiple images handling
    elements.productImageFile.addEventListener('change', handleMultipleImageFiles);
    elements.addImageUrl.addEventListener('click', addImageFromUrl);
    
    // Lightbox controls
    elements.closeLightbox.addEventListener('click', closeLightbox);
    elements.prevImage.addEventListener('click', showPrevImage);
    elements.nextImage.addEventListener('click', showNextImage);
    
    // Login controls
    elements.closeLoginModal.addEventListener('click', closeLoginModal);
    elements.cancelLoginBtn.addEventListener('click', closeLoginModal);
    elements.loginForm.addEventListener('submit', handleLogin);
    
    // Fechar modal clicando fora
    elements.productModal.addEventListener('click', function(e) {
        if (e.target === elements.productModal) {
            closeModal();
        }
    });
    
    // Fechar modal de login clicando fora
    elements.loginModal.addEventListener('click', function(e) {
        if (e.target === elements.loginModal) {
            closeLoginModal();
        }
    });
    
    // Fechar lightbox clicando fora
    elements.lightbox.addEventListener('click', function(e) {
        if (e.target === elements.lightbox) {
            closeLightbox();
        }
    });
    
    // Navegação do lightbox com teclado
    document.addEventListener('keydown', function(e) {
        if (!elements.lightbox.classList.contains('hidden')) {
            if (e.key === 'Escape') {
                closeLightbox();
            } else if (e.key === 'ArrowLeft') {
                showPrevImage();
            } else if (e.key === 'ArrowRight') {
                showNextImage();
            }
        }
    });
    
    // Formatação de preço
    elements.productPrice.addEventListener('input', formatPrice);
}

// Configurar elementos editáveis
function setupContentEditable() {
    const editableElements = document.querySelectorAll('[contenteditable="true"]');
    editableElements.forEach(element => {
        element.addEventListener('blur', saveContentEditable);
        element.addEventListener('keydown', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                element.blur();
            }
        });
    });
}

// Salvar conteúdo editável
function saveContentEditable(e) {
    const key = e.target.classList.contains('logo') ? 'storeName' : 
                e.target.classList.contains('subtitle') ? 'storeDescription' : 'contactInfo';
    localStorage.setItem(key, e.target.textContent);
}

// Carregar conteúdo editável
function loadContentEditable() {
    const storeName = localStorage.getItem('storeName');
    const storeDescription = localStorage.getItem('storeDescription');
    const contactInfo = localStorage.getItem('contactInfo');
    
    if (storeName) {
        document.querySelector('.logo').textContent = storeName;
        document.querySelector('footer span').textContent = storeName;
    }
    if (storeDescription) {
        document.querySelector('.subtitle').textContent = storeDescription;
    }
    if (contactInfo) {
        document.querySelector('.contact-info p').textContent = contactInfo;
    }
}

// Gerenciamento do modo admin
function toggleAdminMode() {
    if (!isAdminMode && !isAuthenticated) {
        // Se não está no modo admin e não está autenticado, mostrar login
        openLoginModal();
        return;
    }
    
    if (isAdminMode) {
        // Saindo do modo admin
        isAdminMode = false;
        isAuthenticated = false; // Desautenticar ao sair
        elements.adminPanel.classList.add('hidden');
        elements.toggleAdmin.innerHTML = `<i class="fas fa-cog"></i> Modo Admin`;
        
        // Esconder controles de admin nos produtos
        const adminControls = document.querySelectorAll('.product-admin-controls');
        adminControls.forEach(control => {
            control.classList.add('hidden');
        });
    }
}

// Carregar produtos do localStorage
function loadProducts() {
    const savedProducts = localStorage.getItem('products');
    if (savedProducts) {
        products = JSON.parse(savedProducts);
    }
    loadContentEditable();
}

// Salvar produtos no localStorage
function saveProducts() {
    localStorage.setItem('products', JSON.stringify(products));
}

// Renderizar produtos
function renderProducts() {
    elements.productsGrid.innerHTML = '';
    
    if (products.length === 0) {
        elements.emptyState.style.display = 'block';
        return;
    }
    
    elements.emptyState.style.display = 'none';
    
    products.forEach(product => {
        const productCard = createProductCard(product);
        elements.productsGrid.appendChild(productCard);
    });
}

// Criar card do produto
function createProductCard(product) {
    const card = document.createElement('div');
    card.className = 'product-card';
    
    // Criar galeria de imagens
    let imageGalleryHTML = '';
    if (product.images && product.images.length > 0) {
        const mainImage = product.images[0];
        imageGalleryHTML = `
            <div class="product-image-gallery">
                <div class="main-image" onclick="openLightbox('${product.id}', 0)">
                    <img src="${mainImage}" alt="${product.name}" onerror="this.parentElement.innerHTML='<i class=\\"fas fa-image\\"></i>'">
                </div>
                ${product.images.length > 1 ? `
                    <div class="image-thumbnails">
                        ${product.images.slice(1, 4).map((img, index) => `
                            <div class="thumbnail" onclick="openLightbox('${product.id}', ${index + 1})">
                                <img src="${img}" alt="${product.name}">
                            </div>
                        `).join('')}
                        ${product.images.length > 4 ? `
                            <div class="thumbnail more-images" onclick="openLightbox('${product.id}', 4)">
                                <span>+${product.images.length - 4}</span>
                            </div>
                        ` : ''}
                    </div>
                ` : ''}
            </div>
        `;
    } else {
        imageGalleryHTML = `
            <div class="product-image">
                <i class="fas fa-image"></i>
            </div>
        `;
    }
    
    card.innerHTML = `
        <div class="product-admin-controls ${!isAdminMode ? 'hidden' : ''}">
            <button class="btn-edit" data-product-id="${product.id}">
                <i class="fas fa-edit"></i>
            </button>
            <button class="btn-delete" data-product-id="${product.id}">
                <i class="fas fa-trash"></i>
            </button>
        </div>
        
        ${imageGalleryHTML}
        
        <div class="product-info">
            <h3 class="product-name">${product.name}</h3>
            <div class="product-price">${product.price}</div>
            ${product.description ? `<p class="product-description">${product.description}</p>` : ''}
            <a href="${generateWhatsAppLink(product)}" target="_blank" class="btn-whatsapp">
                <i class="fab fa-whatsapp"></i> Comprar via WhatsApp
            </a>
        </div>
    `;
    
    // Adicionar event listeners para os botões de admin
    const editBtn = card.querySelector('.btn-edit');
    const deleteBtn = card.querySelector('.btn-delete');
    
    if (editBtn) {
        editBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            e.preventDefault();
            editProduct(product.id);
        });
    }
    
    if (deleteBtn) {
        deleteBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            e.preventDefault();
            deleteProduct(product.id);
        });
    }
    return card;
}

// Gerar link do WhatsApp
function generateWhatsAppLink(product) {
    const storeName = document.querySelector('.logo').textContent || 'Loja';
    const message = `Olá! Tenho interesse no produto:\n\n*${product.name}*\n${product.price}\n\nPoderia me dar mais informações?`;
    const encodedMessage = encodeURIComponent(message);
    return `https://wa.me/?text=${encodedMessage}`;
}

// Modal - Abrir para adicionar produto
function openAddProductModal() {
    editingProductId = null;
    elements.modalTitle.textContent = 'Adicionar Produto';
    elements.productForm.reset();
    clearImagesPreview();
    elements.productModal.classList.remove('hidden');
    elements.productName.focus();
}

// Modal - Abrir para editar produto
function editProduct(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    editingProductId = productId;
    elements.modalTitle.textContent = 'Editar Produto';
    
    elements.productName.value = product.name;
    elements.productPrice.value = product.price;
    elements.productDescription.value = product.description || '';
    elements.productImageUrl.value = '';
    
    // Carregar imagens existentes
    clearImagesPreview();
    if (product.images && product.images.length > 0) {
        currentProductImages = [...product.images];
        product.images.forEach(imageSrc => {
            addImageToPreview(imageSrc);
        });
    }
    
    elements.productModal.classList.remove('hidden');
    elements.productName.focus();
}

// Modal - Fechar
function closeModal() {
    elements.productModal.classList.add('hidden');
    elements.productForm.reset();
    clearImagesPreview();
    editingProductId = null;
}

// Salvar produto
async function saveProduct(e) {
    e.preventDefault();
    
    const name = elements.productName.value.trim();
    const price = elements.productPrice.value.trim();
    const description = elements.productDescription.value.trim();
    
    if (!name || !price) {
        alert('Nome e preço são obrigatórios!');
        return;
    }
    
    if (currentProductImages.length === 0) {
        alert('Adicione pelo menos uma imagem do produto!');
        return;
    }
    
    const productData = {
        id: editingProductId || generateId(),
        name,
        price,
        description,
        images: [...currentProductImages], // Array de imagens
        // Manter compatibilidade com versão anterior
        image: currentProductImages[0] || ''
    };
    
    if (editingProductId) {
        // Editar produto existente
        const index = products.findIndex(p => p.id === editingProductId);
        if (index !== -1) {
            products[index] = productData;
        }
    } else {
        // Adicionar novo produto
        products.push(productData);
    }
    
    saveProducts();
    renderProducts();
    closeModal();
    
    // Mostrar controles de admin se estiver no modo admin
    if (isAdminMode) {
        const adminControls = document.querySelectorAll('.product-admin-controls');
        adminControls.forEach(control => {
            control.classList.remove('hidden');
        });
    }
}

// Função para converter arquivo para Base64
function convertFileToBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = function(e) {
            resolve(e.target.result);
        };
        reader.onerror = function(error) {
            reject(error);
        };
        reader.readAsDataURL(file);
    });
}

// Deletar produto
function deleteProduct(productId) {
    if (confirm('Tem certeza que deseja excluir este produto?')) {
        products = products.filter(p => p.id !== productId);
        saveProducts();
        renderProducts();
    }
}

// Gerar ID único
function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

// Formatação de preço
function formatPrice(e) {
    let value = e.target.value.replace(/\D/g, '');
    if (value) {
        value = (parseInt(value) / 100).toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        });
        e.target.value = value;
    }
}

// Preview de imagem por arquivo
function handleImageFileChange(e) {
    const file = e.target.files[0];
    if (file) {
        elements.productImageUrl.value = ''; // Limpar URL se arquivo foi selecionado
        const reader = new FileReader();
        reader.onload = function(e) {
            elements.previewImg.src = e.target.result;
            elements.imagePreview.classList.remove('hidden');
        };
        reader.readAsDataURL(file);
    } else {
        elements.imagePreview.classList.add('hidden');
    }
}

// Preview de imagem por URL
function handleImageUrlChange(e) {
    const url = e.target.value.trim();
    if (url) {
        elements.productImageFile.value = ''; // Limpar arquivo se URL foi inserida
        elements.previewImg.src = url;
        elements.imagePreview.classList.remove('hidden');
        
        // Verificar se a imagem carrega
        elements.previewImg.onerror = function() {
            elements.imagePreview.classList.add('hidden');
        };
    } else {
        elements.imagePreview.classList.add('hidden');
    }
}

// Exportar dados
function exportData() {
    const data = {
        products: products,
        storeName: document.querySelector('.logo').textContent,
        storeDescription: document.querySelector('.subtitle').textContent,
        contactInfo: document.querySelector('.contact-info p').textContent
    };
    
    const dataStr = JSON.stringify(data, null, 2);
    const dataBlob = new Blob([dataStr], {type: 'application/json'});
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = 'loja-dados.json';
    link.click();
    
    URL.revokeObjectURL(url);
}

// Importar dados
function importData(e) {
    const file = e.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const data = JSON.parse(e.target.result);
            
            if (data.products && Array.isArray(data.products)) {
                products = data.products;
                saveProducts();
                renderProducts();
            }
            
            if (data.storeName) {
                document.querySelector('.logo').textContent = data.storeName;
                document.querySelector('footer span').textContent = data.storeName;
                localStorage.setItem('storeName', data.storeName);
            }
            
            if (data.storeDescription) {
                document.querySelector('.subtitle').textContent = data.storeDescription;
                localStorage.setItem('storeDescription', data.storeDescription);
            }
            
            if (data.contactInfo) {
                document.querySelector('.contact-info p').textContent = data.contactInfo;
                localStorage.setItem('contactInfo', data.contactInfo);
            }
            
            alert('Dados importados com sucesso!');
        } catch (error) {
            alert('Erro ao importar dados. Verifique se o arquivo está no formato correto.');
        }
    };
    reader.readAsText(file);
    
    // Limpar input
    e.target.value = '';
}

// Funções globais para os botões inline
window.editProduct = editProduct;
window.deleteProduct = deleteProduct;



// ===== FUNÇÕES PARA MÚLTIPLAS IMAGENS =====

// Lidar com múltiplos arquivos de imagem
async function handleMultipleImageFiles(e) {
    const files = Array.from(e.target.files);
    
    for (const file of files) {
        try {
            const base64 = await convertFileToBase64(file);
            currentProductImages.push(base64);
            addImageToPreview(base64);
        } catch (error) {
            console.error('Erro ao processar imagem:', error);
        }
    }
    
    // Limpar o input para permitir selecionar os mesmos arquivos novamente
    e.target.value = '';
}

// Adicionar imagem por URL
async function addImageFromUrl() {
    const url = elements.productImageUrl.value.trim();
    if (!url) {
        alert('Por favor, insira uma URL válida');
        return;
    }
    
    // Verificar se a URL já foi adicionada
    if (currentProductImages.includes(url)) {
        alert('Esta imagem já foi adicionada');
        return;
    }
    
    currentProductImages.push(url);
    addImageToPreview(url);
    elements.productImageUrl.value = '';
}

// Adicionar imagem ao preview
function addImageToPreview(imageSrc) {
    const imageContainer = document.createElement('div');
    imageContainer.className = 'image-preview-item';
    
    imageContainer.innerHTML = `
        <img src="${imageSrc}" alt="Preview" onerror="this.parentElement.innerHTML='<div class=\\"error\\">Erro ao carregar imagem</div>'">
        <button type="button" class="remove-image" onclick="removeImageFromPreview(this, '${imageSrc.replace(/'/g, "\\'")}')">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    elements.imagesPreview.appendChild(imageContainer);
}

// Remover imagem do preview
function removeImageFromPreview(button, imageSrc) {
    const index = currentProductImages.indexOf(imageSrc);
    if (index > -1) {
        currentProductImages.splice(index, 1);
    }
    button.parentElement.remove();
}

// Limpar preview de imagens
function clearImagesPreview() {
    elements.imagesPreview.innerHTML = '';
    currentProductImages = [];
}

// ===== FUNÇÕES DO LIGHTBOX =====

// Abrir lightbox
function openLightbox(productId, imageIndex = 0) {
    const product = products.find(p => p.id === productId);
    if (!product || !product.images || product.images.length === 0) return;
    
    currentLightboxImages = product.images;
    currentLightboxIndex = imageIndex;
    
    updateLightboxImage();
    elements.lightbox.classList.remove('hidden');
    document.body.style.overflow = 'hidden'; // Prevenir scroll da página
}

// Fechar lightbox
function closeLightbox() {
    elements.lightbox.classList.add('hidden');
    document.body.style.overflow = ''; // Restaurar scroll da página
    currentLightboxImages = [];
    currentLightboxIndex = 0;
}

// Mostrar imagem anterior
function showPrevImage() {
    if (currentLightboxImages.length <= 1) return;
    
    currentLightboxIndex = currentLightboxIndex > 0 
        ? currentLightboxIndex - 1 
        : currentLightboxImages.length - 1;
    
    updateLightboxImage();
}

// Mostrar próxima imagem
function showNextImage() {
    if (currentLightboxImages.length <= 1) return;
    
    currentLightboxIndex = currentLightboxIndex < currentLightboxImages.length - 1 
        ? currentLightboxIndex + 1 
        : 0;
    
    updateLightboxImage();
}

// Atualizar imagem do lightbox
function updateLightboxImage() {
    if (currentLightboxImages.length === 0) return;
    
    elements.lightboxImage.src = currentLightboxImages[currentLightboxIndex];
    elements.currentImageIndex.textContent = currentLightboxIndex + 1;
    elements.totalImages.textContent = currentLightboxImages.length;
    
    // Mostrar/esconder botões de navegação
    const showNavigation = currentLightboxImages.length > 1;
    elements.prevImage.style.display = showNavigation ? 'block' : 'none';
    elements.nextImage.style.display = showNavigation ? 'block' : 'none';
}

// Função global para o lightbox (chamada pelo onclick)
window.openLightbox = openLightbox;


// ===== FUNÇÕES DE AUTENTICAÇÃO =====

// Abrir modal de login
function openLoginModal() {
    elements.loginModal.classList.remove('hidden');
    elements.adminUsername.focus();
    elements.loginError.classList.add('hidden');
    elements.loginForm.reset();
}

// Fechar modal de login
function closeLoginModal() {
    elements.loginModal.classList.add('hidden');
    elements.loginForm.reset();
    elements.loginError.classList.add('hidden');
}

// Processar login
function handleLogin(e) {
    e.preventDefault();
    
    const username = elements.adminUsername.value.trim();
    const password = elements.adminPassword.value.trim();
    
    // Verificar credenciais
    if (username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
        // Login bem-sucedido
        isAuthenticated = true;
        isAdminMode = true;
        
        // Ativar modo admin
        elements.adminPanel.classList.remove('hidden');
        elements.toggleAdmin.innerHTML = `<i class="fas fa-cog"></i> Sair do Admin`;
        
        // Mostrar controles de admin nos produtos
        const adminControls = document.querySelectorAll('.product-admin-controls');
        adminControls.forEach(control => {
            control.classList.remove('hidden');
        });
        
        // Fechar modal de login
        closeLoginModal();
        
        // Feedback visual (opcional)
        showNotification('Login realizado com sucesso!', 'success');
    } else {
        // Login falhou
        elements.loginError.classList.remove('hidden');
        elements.adminPassword.value = '';
        elements.adminPassword.focus();
        
        // Feedback visual de erro
        elements.loginModal.classList.add('shake');
        setTimeout(() => {
            elements.loginModal.classList.remove('shake');
        }, 500);
    }
}

// Ativar modo admin após login bem-sucedido
function activateAdminMode() {
    isAdminMode = true;
    elements.adminPanel.classList.remove('hidden');
    elements.toggleAdmin.innerHTML = `<i class="fas fa-cog"></i> Sair do Admin`;
    
    // Mostrar controles de admin nos produtos
    const adminControls = document.querySelectorAll('.product-admin-controls');
    adminControls.forEach(control => {
        control.classList.remove('hidden');
    });
}

// Função para mostrar notificações (opcional)
function showNotification(message, type = 'info') {
    // Criar elemento de notificação
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    // Adicionar ao body
    document.body.appendChild(notification);
    
    // Mostrar com animação
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);
    
    // Remover após 3 segundos
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Verificar se há sessão ativa (opcional - para manter login entre recarregamentos)
function checkAuthSession() {
    const sessionActive = localStorage.getItem('adminSession');
    const sessionTime = localStorage.getItem('adminSessionTime');
    
    if (sessionActive && sessionTime) {
        const now = new Date().getTime();
        const sessionStart = parseInt(sessionTime);
        const sessionDuration = 30 * 60 * 1000; // 30 minutos
        
        if (now - sessionStart < sessionDuration) {
            // Sessão ainda válida
            isAuthenticated = true;
            return true;
        } else {
            // Sessão expirada
            localStorage.removeItem('adminSession');
            localStorage.removeItem('adminSessionTime');
        }
    }
    
    return false;
}

// Salvar sessão de admin (opcional)
function saveAuthSession() {
    localStorage.setItem('adminSession', 'active');
    localStorage.setItem('adminSessionTime', new Date().getTime().toString());
}

// Limpar sessão de admin
function clearAuthSession() {
    localStorage.removeItem('adminSession');
    localStorage.removeItem('adminSessionTime');
}


// Tornar as funções globais para uso nos onclick
window.editProduct = editProduct;
window.deleteProduct = deleteProduct;

