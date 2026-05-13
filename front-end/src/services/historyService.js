const API_URL = "http://localhost:3000";

export async function getHistoryByGame(id) {

    const response = await fetch(
        `${API_URL}/history/game/${id}`
    );

    if (!response.ok) {
        throw new Error("Erro ao buscar histórico");
    }

    return response.json();
}

export async function getHistoryByUserAndGame(
    id_usuario,
    id_jogo
) {

    const response = await fetch(
        `http://localhost:3000/history/${id_usuario}/${id_jogo}`
    );

    if (!response.ok) {
        throw new Error('Erro ao buscar histórico');
    }

    return response.json();
}