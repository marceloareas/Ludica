const API_URL = "http://localhost:3000"; 

export async function getGameById(id) {
  const response = await fetch(`${API_URL}/games/${id}`);
  
  if (!response.ok) {
    throw new Error("Erro ao buscar dados do servidor");
  }
  
  return await response.json();
}