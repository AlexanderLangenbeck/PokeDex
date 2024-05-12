let pokemon = [];
let start= "0";
let nextPokemon = 1;
let pokemonName = [];
let pokemonStats = [];
let pokemonId = [];


function init(){
    nextPokemon =1;
    loadContent();
    loadPokemon();
}


function loadContent(){
    let content = document.getElementById('content');

    content.innerHTML=/*html */`
    <div id="pokeContent" class="pokeCards"></div>
    <div>
        <button onclick="loadNextPokemon()" class="btn btn-primary">Show 20 More</button>
    </div>
    `;
}


async function loadPokemon(start){
    start = start || 1;
    for (let i = start; i < start+20; i++) {
        let url = `https://pokeapi.co/api/v2/pokemon/${i}`;
        let response =  await fetch(url);
        let pokemons = await response.json();
        pushArrays(pokemons);
        loadSmallCard(i-1);
    }
}


function pushArrays(pokemons){
    pokemon.push(pokemons);
    pokemonName.push(pokemons['name']);
    pokemonStats.push(pokemons['stats']);
    pokemonId.push(pokemons['id']);
}


function loadSmallCard(i){
     let content = document.getElementById('pokeContent');
     content.innerHTML += smallCardInput(i);
     checkForSecondType(i)
}


async function openBigCard(i){
    let content = document.getElementById('bigLevel');
    let smallCard = document.getElementById('content');
    if(i>=0){
        smallCard.style.display ='none';
        document.getElementById('bigLevel').classList.add('bigLevel');
        content.innerHTML = openBigCardInput(i);
        if(pokemon[i]["types"].length > 1){
            let type = document.getElementById('headPart');
            type.innerHTML += `<div class="type">${pokemon[i]['types']['1']['type']['name']}</div>`; 
        }
    }
    else{
        i=0;
        openBigCard(i);
    }
    
}


async function loadNextPokemon(){
    nextPokemon += 20;
    await loadPokemon(nextPokemon);
}


function checkForSecondType(i){
    if(pokemon[i]['types'].length > 1){
        let type = document.getElementById("infoShow" + i);
        type.innerHTML += `<div class="type">${pokemon[i]['types']['1']['type']['name']}</div>`; 
    }
}


function search(){
    let input = document.getElementById("search").value.toLowerCase();
    let pokemonCards = document.querySelectorAll('.pokeCard');

    if(input.length >= 3){
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


function closeBigCard(){
    let smallCard = document.getElementById('content');
    smallCard.style.display ='flex';
    document.getElementById('bigLevel').innerHTML=``;
    document.getElementById('bigLevel').classList.remove('bigLevel');
}


function smallCardInput(i){
    return/*html*/`
    <div onclick ="openBigCard(${pokemonId[i]-1})" id="pokeCard" class="pokeCard bg-${pokemon[i]['types']['0']['type']['name']}">
        <div id="infoShow${i}" class="leftSideCard">
            <h2 id="pokemonName">${pokemonName[i]}</h2>
            <div id="pokeType${i}" class="type"> ${pokemon[i]['types']['0']['type']['name']}</div>
        </div>
        <div class="rightSideCard">
            <div>ID#${pokemonId[i]}</div>
            <img id="card" src='${pokemon[i]['sprites']['other']['dream_world']['front_default']}' class="pokeImg" alt="...">
        </div>
    </div>
    `;
}


function openBigCardInput(i){
    return/*html */`
        <div class="bigCard bg-${pokemon[i]['types']['0']['type']['name']}">
            <div class="bigCardInput">
                <div id="headPart" class="headPart">
                    <div class="bidCardHeader">
                        <div>${pokemonName[i]}</div>
                        <div>#${i+1}</div>
                        <div onclick="closeBigCard()" class="hover">X</div>
                    </div>
                    <span class="type">${pokemon[i]['types']['0']['type']['name']}</span>
                </div>
                <div class="pokemonInput">
                    <img class="bigCardImg" src="${pokemon[i]['sprites']['other']['dream_world']['front_default']}">
                    <div id="bigCardContent" class="bigCardContent">
                        <span onclick="openBigCard(${i-1})" class="hover"><</span>
                        <span onclick="bigCardContentAboutInput(${i})" class="hover">About</span>
                        <span onclick="bigCardContentStats(${i})" class="hover">Stats</span>
                        <span onclick="bigCardContentMovesInput(${i})" class="hover">Moves</span>
                        <span onclick="openBigCard(${i+1})"class="hover">></span>
                    </div>
                    <div id="pokemonStats" class="pokeomnStats">
                        <span><b>Height:</b>  ${pokemon[i]['height']}</span>
                        <span><b>Weight:</b>  ${pokemon[i]['weight']}</span>
                        <span><b>Abilities:</b>  ${pokemon[i]['abilities']['0']['ability']['name']}</span>
                        <span><b>Base-Experience:</b>  ${pokemon[i]['base_experience']}</span>
                    </div>
                </div>
            </div>
        </div>
    `
}


function bigCardContentAboutInput(i){
    document.getElementById('pokemonStats').style.flexDirection = 'column';
    let bigCardContent = document.getElementById('pokemonStats');
    bigCardContent.innerHTML = /*html */`
        <span><b>Height:</b>  ${pokemon[i]['height']}</span>
        <span><b>Weight:</b>  ${pokemon[i]['weight']}</span>
        <span><b>Abilities:</b>  ${pokemon[i]['abilities']['0']['ability']['name']}</span>
        <span><b>Base-Experience:</b>  ${pokemon[i]['base_experience']}</span>
    `;
}


function bigCardContentStats(i){
    document.getElementById('pokemonStats').style.flexDirection = 'row';
    let bigCardContent = document.getElementById('pokemonStats');
    let hpStat = (250 - pokemonStats[i]['0']['base_stat']);
    let attackStats = 250 - pokemonStats[i]['1']['base_stat'];
    let defenseStats = 250 - pokemonStats[i]['2']['base_stat'];
    let specAttackStats = 250 - pokemonStats[i]['3']['base_stat'];
    let specDefense = 250 - pokemonStats[i]['4']['base_stat'];
    let speed = 250 - pokemonStats[i]['5']['base_stat'];
    bigCardContent.innerHTML = bigCardContentStatsInput(i,hpStat,attackStats,defenseStats,specAttackStats,specDefense,speed);
}


function bigCardContentStatsInput(i,hpStat,attackStats,defenseStats,specAttackStats,specDefense,speed){
    return /*html */`
    <svg width="400" height="100%" viewBox="10 0 500 300" xmlns="http://www.w3.org/2000/svg">

        <rect x="0" y="0" width="500" height="100%" fill="#f0f0f0" />

        <rect x="50" y="50" width="50" height="0" fill="#4285F4">
            <animate attributeName="height" from="0" to="${pokemonStats[i]['0']['base_stat']}" dur="1s" fill="freeze"/>
            <animate attributeName="y" from="250" to="${hpStat}" dur="1s" fill="freeze"/>
        </rect>

        <rect x="120" y="80" width="50" height="170" fill="#34A853" >
            <animate attributeName="height" from="0" to="${pokemonStats[i]['1']['base_stat']}" dur="1s" fill="freeze"/>
            <animate attributeName="y" from="250" to="${attackStats}" dur="1s" fill="freeze"/>
        </rect>

        <rect x="190" y="30" width="50" height="220" fill="#FBBC05" >
            <animate attributeName="height" from="0" to="${pokemonStats[i]['2']['base_stat']}" dur="1s" fill="freeze"/>
            <animate attributeName="y" from="250" to="${defenseStats}" dur="1s" fill="freeze"/>
        </rect>

        <rect x="260" y="110" width="50" height="140" fill="#EA4335" >
        <animate attributeName="height" from="0" to="${pokemonStats[i]['3']['base_stat']}" dur="1s" fill="freeze"/>
            <animate attributeName="y" from="250" to="${specAttackStats}" dur="1s" fill="freeze"/>
        </rect>
        <rect x="330" y="60" width="50" height="190" fill="#9C27B0" >
        <animate attributeName="height" from="0" to="${pokemonStats[i]['4']['base_stat']}" dur="1s" fill="freeze"/>
            <animate attributeName="y" from="250" to="${specDefense}" dur="1s" fill="freeze"/>
        </rect>
        <rect x="400" y="150" width="50" height="100" fill="#FF5722" >
        <animate attributeName="height" from="0" to="${pokemonStats[i]['5']['base_stat']}" dur="1s" fill="freeze"/>
            <animate attributeName="y" from="250" to="${speed}" dur="1s" fill="freeze"/>
        </rect>

        <text x="20" y="250" fill="black">0</text>
        <text x="20" y="200" fill="black">50</text>
        <text x="20" y="150" fill="black">100</text>
        <text x="20" y="100" fill="black">150</text>
        <text x="20" y="50" fill="black">200</text>

        <rect x="50" y="250" width="20" height="20" fill="#4285F4" />
        <text x="75" y="265" fill="black">HP</text>
        <rect x="150" y="250" width="20" height="20" fill="#34A853" />
        <text x="175" y="265" fill="black">Attack</text>
        <rect x="50" y="280" width="20" height="20" fill="#FBBC05" />
        <text x="75" y="295" fill="black">Defense</text>
        <rect x="150" y="280" width="20" height="20" fill="#EA4335" />
        <text x="175" y="295" fill="black">Special Attack</text>
        <rect x="280" y="280" width="20" height="20" fill="#9C27B0" />
        <text x="305" y="295" fill="black">Special Defense</text>
        <rect x="280" y="250" width="20" height="20" fill="#FF5722" />
        <text x="305" y="265" fill="black">Speed</text>
    </svg>
    `
}


function bigCardContentMovesInput(i){
    document.getElementById('pokemonStats').style.flexDirection = 'row';
    let bigCardContent = document.getElementById('pokemonStats');
    bigCardContent.innerHTML = /*html */`
        <ul>
            <li>${pokemon[i]['moves']['0']['move']['name']}</li>
            <li>${pokemon[i]['moves']['1']['move']['name']}</li>
            <li>${pokemon[i]['moves']['2']['move']['name']}</li>
            <li>${pokemon[i]['moves']['3']['move']['name']}</li>
            <li>${pokemon[i]['moves']['4']['move']['name']}</li>
            <li>${pokemon[i]['moves']['5']['move']['name']}</li>
            <li>${pokemon[i]['moves']['6']['move']['name']}</li>
            <li>${pokemon[i]['moves']['7']['move']['name']}</li>
        </ul>
    `;
}