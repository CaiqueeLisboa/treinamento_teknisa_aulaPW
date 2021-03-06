/* função que inicia o body com o resultado de pesquisa dos cards*/
function preRender(){
    let countVisibleCards = getCountVisibleCards();
    updateResults(countVisibleCards);
}

/* faz a contagem de quantos cards são visiveis */
function getCountVisibleCards(){
    return Array.from(document.getElementsByClassName("card")).filter((card) => !card.getElementsByClassName.display || card.getElementsByClassName.display !=="none").length;
}

/* Atualiza o resultado dos cards */
function updateResults(count) {
    document.getElementById("countResult").textContent = count;
}

/* Função que faz a pesquisa no container */
function filter() {
    let {search, operation, languages} = getFilterProperties();
    let interval = setInterval((_) => {
        let[containerEl] = document.getElementsByClassName("container");
        let changedText = search !== getSearchValue();
        if(!changedText) clearInterval(interval);
        if(containerEl && containerEl.children && !changedText) {
            let visibleCards = updateVisibleCards(containerEl,search,operation, languages);
            updateResults(visibleCards);
        }
    }, 1000);
}

/* Função que armazena o que foi feito nos campos de pesquisa */
function getFilterProperties() {
    let search = getSearchValue();
    let[radio] = getSelectedRadio();
    let operation = radio.id == "1" ? "AND" : "OR";
    let languages = Array.from(getSelectedLanguages()).map((lang) => lang.name);
    return {
        search,
        operation,
        languages,
    }
}

/* Função que armazena oq foi digitado no campo de busca por nome */
function getSearchValue(){
    let inputSearchEl = document.getElementById("nameSearch");
    return inputSearchEl.value;
}

function getSelectedRadio(){
    return Array.from(document.querySelectorAll('header input[type="radio"]:checked'));
}

/* Função que armazena oq foi selecionado no campo por linguagem */
function getSelectedLanguages(){
    return Array.from(document.querySelectorAll('header input[type="checkbox"]:checked'));
}

/* Função que faz a validação dos cards baseado nas pesquisas */
function updateVisibleCards(containerEl, search, operation, selectedLanguages){
    let visibleCards = 0;
    /* percorre o container */
    Array.from(containerEl.children).forEach((cardEl) => {
        /* recebe o nome do titulo do card */
        let [titleEl] = cardEl.getElementsByClassName("card-title");
        /* recebe as linguagens do card */
        let cardLanguages = Array.from(cardEl.getElementsByClassName("iconLanguage")).map((image) => image.name);
        /* Se existir um tilte no card ele começa as validações */
        if(titleEl) {
            let isMatchName = isMatchByName(titleEl.textContent, search);
            if(!isMatchName && operation == "AND"){
                hideCard(cardEl);
            } else if(isMatchName && operation == "OR") {
                showCard(cardEl);
                visibleCards++;
            } else if(isMatchName && operation == "AND"){
                let isMatchLanguage = isMatchByLanguage(cardLanguages, selectedLanguages);
                if(isMatchLanguage) {
                    showCard(cardEl);
                    visibleCards++;
                } else{
                    hideCard(cardEl);
                }
            } else if (!isMatchName && operation == "OR") {
                let isMatchLanguage = isMatchByLanguage(cardLanguages, selectedLanguages);
                if(isMatchLanguage){
                    showCard(cardEl);
                    visibleCards++;
                } else {
                    hideCard(cardEl);
                }
            }
        }
    });
    return visibleCards;
}

/* função que recebe oq foi digitado para a validação */
function isMatchByName(textCard, textInput) {
    return textCard.toLowerCase().includes(textInput.toLowerCase());
}

/* função que recebe oq foi selecionado para a validação */
function isMatchByLanguage(cardLanguages, selectedLanguages){
    return cardLanguages.some(cardLang => selectedLanguages.includes(cardLang));
}

/* função que esconde o card */
function hideCard(card) {
    card.style.display = "none";
};

/* função que mostra o card */
function showCard(card) {
    card.style.display = "flex";
}

/* Constante o html do modal */
const modalTemplate = `
      <div class="modal">
        <button class="fechar">x</button>
        <div class="profilePictureModal">
            <img class="image" name ="image-profile" src="__DEV_IMAGE__" alt="desenvolvedor" />
        </div>
        <div class="profileDescriptionModal">
            <div style="display: flex; flex-direction: column">
                <h2 class="card-title" name="devname">__DEV_NAME__</h2>
                <span name="age">__DEV_AGE__</span>
                <span name="description">__DEV_DESCRIPTION__</span>
                <span name="description">__DEV_DESCRIPTION_ABILITY__</span>
                <h3>Contato</h3>
                <span name="mail">Email: <a href="#">__DEV_MAIL__</a></span>
                <span name="git">Github: <a href="#">__DEV_GIT__</a></span>
                <span name="phone">Telefone:__DEV_PHONE__</span>
            </div>
            <div class="languages">
            <h3>Linguagens</h3>
                __DEV_LANGUAGES__
            </div>
        </div>
      </div>
`;

/*Percorre os cards para adicionar a função de click para abrir o modal*/
Array.from(document.querySelectorAll('.card')).forEach(card => {
    card.addEventListener('click', (event) => iniciaModal('modal-profile', event.currentTarget.id));
});


/* Função que faz funcionar o click para abrir o modal */
function iniciaModal(modalId, cardId){
    fillModal(getUserInfo(cardId));
    const modal = document.getElementById(modalId);
    if(modal){
        modal.classList.add("mostrar");
        modal.addEventListener("click", (e) => {
            if(e.target.id == modalId || e.target.className == "fechar"){
                modal.classList.remove("mostrar");
            }
        });
    }
}

/* Função que pega as informações dos cards e adiciona em um objeto*/
function getUserInfo(id){
    let cardUser = document.getElementById(id);
    console.log(cardUser);
    let userData = {};
    if(cardUser) {
        userData = ['age', 'mail', 'phone', 'github', 'username', 'description', 'descriptionAbility', 'experience'].
        reduce((acc,name) => {
            acc[name] = getTextContentByName(cardUser,name);
            return acc; 
        }, {});
        userData.languages = Array.from(cardUser.querySelectorAll(".languages > .iconLanguage")).reduce(
            function (acc, el){
                let nameLanguage = el.name;
                acc[nameLanguage] = `${el.getAttribute('experience')}`;
                return acc;
            }, {});
            userData.picture = cardUser.querySelector(".profilePicture > img").getAttribute("src");   
    return userData;    
    }
};

function getTextContentByName(el, name, defaultValue = ""){
    let element = el.querySelector(`*[name=${name}]`);
    return element ? element.textContent : defaultValue;
}

function fillModal(userInfo){
    let descriptionLanguages = getDescriptionLanguages();   
    languages = Object.keys(userInfo.languages).map((langCode) => {
        return `
            <div class="languageDescription">
                <div class="language-name">
                    <img name="${langCode}" class="iconLanguage" src="images/${langCode}.png" alt="language"/>
                    <span>${descriptionLanguages[langCode]}</span>
                </div>
                <div class="modal-experience">
                    <span>${userInfo.languages[langCode]} Anos </span>
                </div>
            </div>
        `;
    })
    .join("\n");
    modal = modalTemplate;
    modal = modal.replaceAll("__DEV_IMAGE__", userInfo.picture);
    modal = modal.replaceAll("__DEV_NAME__", userInfo.username);
    modal = modal.replaceAll("__DEV_AGE__", userInfo.age);
    modal = modal.replaceAll("__DEV_DESCRIPTION__", userInfo.description);
    modal = modal.replaceAll("__DEV_DESCRIPTION_ABILITY__", userInfo.descriptionAbility);
    modal = modal.replaceAll("__DEV_MAIL__", userInfo.mail);
    modal = modal.replaceAll("__DEV_PHONE__", userInfo.phone);
    modal = modal.replaceAll("__DEV_GIT__", userInfo.github);
    modal = modal.replaceAll("__DEV_LANGUAGES__", languages);
    
    document.querySelector('#modal-profile').innerHTML = modal;
    console.log(userInfo);
};

function getDescriptionLanguages(){
    let description = {
        js: "JavaScript",
        php: "PHP",
        java: "Java",
        python: "Python",
    };
    return description;
}