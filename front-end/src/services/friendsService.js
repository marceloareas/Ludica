const API_URL = "http://localhost:3000";

export async function getRankingByGame(id_usuario, id_jogo) {
  const response = await fetch(
    `${API_URL}/friends/ranking/${id_usuario}/${id_jogo}`
  );

  if (!response.ok) {
    const err = await response.text();
    console.error("Erro backend ranking:", err);
    throw new Error("Erro ao buscar ranking");
  }

  return await response.json();
}