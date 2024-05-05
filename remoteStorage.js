let pokemon = [];
let start= "0";
let nextPokemon = 1;
let pokemonName = [];

function init(){
    nextPokemon =1;
    loadContent();
    loadPokemon();
}

function loadContent(){
    let content = document.getElementById('content');

    content.innerHTML=/*html */`
    <div id="pokeContent" class="pokeCards"></div>
    <button onclick="loadNextPokemon()" class="btn btn-primary">Show More</button>
    `;
}


async function loadPokemon(start){
    start = start || 1;
    for (let i = start; i < start+20; i++) {
        let url = `https://pokeapi.co/api/v2/pokemon/${i}`;
        let response =  await fetch(url);
        let pokemons = await response.json();

        pokemonName.push(pokemons['name']);
        loadSmallCard(pokemons, i);
    }
}


function loadSmallCard(currentPokemon,i){
     let content = document.getElementById('pokeContent');
     content.innerHTML += smallCardInput(currentPokemon,i);
     checkForSecondType(currentPokemon,i)
}


async function openBigCard(id){
    let content = document.getElementById('content');
    content.innerHTML = ``;
    let url = `https://pokeapi.co/api/v2/pokemon/${id}`;
    let response =  await fetch(url);
    let pokemon = await response.json();

    content.innerHTML = openBigCardInput(pokemon);
    if(pokemon["types"].length > 1){
        let type = document.getElementById('headPart');
        type.innerHTML += `<div class="type">${pokemon['types']['1']['type']['name']}</div>`; 
    }
}


async function loadNextPokemon(){
    nextPokemon += 20;
    await loadPokemon(nextPokemon);
}


function checkForSecondType(currentPokemon,i){
    if(currentPokemon["types"].length > 1){
        let type = document.getElementById("infoShow" + i);
        type.innerHTML += `<div class="type">${currentPokemon['types']['1']['type']['name']}</div>`; 
    }
}


function search(){
    let input = document.getElementById("search").value.toLowerCase();
    let pokemonCards = document.querySelectorAll('.pokeCard');

    if(input.length >=3){
        searchTrue(input, pokemonCards);
    }
    else{
        pokemonCards.forEach(container => {
            container.style.display ='flex';
        });
    }
}


function searchTrue(input, pokemonCards){
    pokemonCards.forEach(container => {
        let pokemonName = container.querySelector('#pokemonName').innerText.toLowerCase();
        if(pokemonName.includes(input)){
            container.style.display ='flex';
        }
        else{
            container.style.display ='none';
        }
        })
}


function smallCardInput(currentPokemon,i){
    return/*html*/`
    <div onclick ="openBigCard(${currentPokemon['id']})" id="pokeCard" class="pokeCard bg-${currentPokemon['types']['0']['type']['name']}">
        <div id="infoShow${i}" class="leftSideCard">
            <h2 id="pokemonName">${currentPokemon['name']}</h2>
            <div id="pokeType${i}" class="type"> ${currentPokemon['types']['0']['type']['name']}</div>
        </div>
        <div class="rightSideCard">
            <div>ID#${currentPokemon["id"]}</div>
            <img id="card" src='${currentPokemon['sprites']['other']['dream_world']['front_default']}' class="pokeImg" alt="...">
        </div>
    </div>
    `;
}


function openBigCardInput(pokemon){
    return/*html */`
        <div class="bigCard bg-${pokemon["types"]["0"]["type"]["name"]}">
            <div class="bigCardInput">
                <div id="headPart" class="headPart">
                    <div class="bidCardHeader">
                        <div>${pokemon['name']}</div>
                        <div>#${pokemon['id']}</div>
                        <div onclick="init()" class="hover">X</div>
                    </div>
                    <span class="type">${pokemon['types']['0']['type']['name']}</span>
                </div>
                <div class="pokemonInput">
                    <img class="bigCardImg" src="${pokemon['sprites']['other']['dream_world']['front_default']}">
                    <div id="bigCardContent" class="bigCardContent">
                        <span onclick="openBigCard(${pokemon['id']-1})" class="hover"><</span>
                        <span class="hover">About</span>
                        <span onclick="bigCardContentStatsInput(${pokemon})" class="hover">Stats</span>
                        <span class="hover">Moves</span>
                        <span onclick="openBigCard(${pokemon['id']+1})"class="hover">></span>
                    </div>
                    <div id="pokemonStats" class="pokeomnStats">
                        <span><b>Height:</b>  ${pokemon['height']}</span>
                        <span><b>Weight:</b>  ${pokemon['weight']}</span>
                        <span><b>Abilities:</b>  ${pokemon['abilities']['0']['ability']['name']}</span>
                        <span><b>Base-Experience:</b>  ${pokemon['base_experience']}</span>
                    </div>
                </div>
            </div>
        </div>
    `
}


function bigCardContentStatsInput(pokemon){
    let bigCardContent = document.getElementById('pokemonStats');
    bigCardContent.innerHTML = /*html */`
        <table>
            <tr>
                <th>Kategorie</th>
                <th>Werte</th>
            </tr>
            <tr>
                <td>HP</td>
                <td>${pokemon['stats']['0']['base_stat']}</td>
            </tr>
            <tr>
                <td>Attack</td>
                <td>${pokemon['stats']['1']['base_stat']}</td>
            </tr>
            <tr>
                <td>Defense</td>
                <td>${pokemon['stats']['2']['base_stat']}</td>
            </tr>
            <tr>
                <td>Special Attack</td>
                <td>${pokemon['stats']['3']['base_stat']}</td>
            </tr>
            <tr>
                <td>Special Defense</td>
                <td>${pokemon['stats']['4']['base_stat']}</td>
            </tr>
            <tr>
                <td>Speed</td>
                <td>${pokemon['stats']['5']['base_stat']}</td>
            </tr>
        </table>
    `;
}

