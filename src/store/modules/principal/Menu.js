export const MENU_SIMPLE = 'simple'

export default class Menu {
    nombre
    link
    permiso
    nivel
    tipo
    constructor(
        nombre = null,
        link = null,
        permiso = null,
        nivel = null,
        tipo = null,
    ) {
        this.nombre = nombre
        this.link = link
        this.permiso = permiso
        this.nivel = nivel
        this.tipo = tipo
    }

    isSimple(){
        return this.tipo === MENU_SIMPLE
    }
}