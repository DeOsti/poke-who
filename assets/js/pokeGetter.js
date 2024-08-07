// Criar um valor aleatório entre 1 e 1025
// Verificar se pokemon com esse ID está salvo localmente
// Caso sim, usar local. Caso não, Pegar por API e salvar localmente

// Salvar todos os dados em um objeto "pokemon"

// Apenas a entrada de pokedex estará disponível. Todo o resto deverá ser reveladopouco a pouco.

function getTypeColor(type) {
    const typeColor = {
        normal: "#9FA19F",
        fire: "#E62829",
        water: "#2980EF",
        electric: "#FAC000",
        grass: "#3FA129",
        fighting: "#FF8000",
        poison: "#9141CB",
        ground: "#915121",
        flying: "#81B9EF",
        psychic: "#EF4179",
        bug: "#91A119",
        rock: "#AFA981",
        ghost: "#704170",
        ice: "#3DCEF3",
        dragon: "#5060E1",
        dark: "#624D4E",
        steel: "#60A1B8",
        fairy: "#EF70EF",
        stellar: "#40B5A5",
    };

    return [typeColor[type], `../images/${type}.png`];
}

console.log(getTypeColor("normal"));
