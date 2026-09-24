export function getPerfilUsuario() {
  if (localStorage.getItem('tipo_usuario') === 'Administrador') return 'admin';
  return localStorage.getItem('perfil_usuario') === 'Professor' ? 'professor' : 'aluno';
}
