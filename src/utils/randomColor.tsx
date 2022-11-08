export function randomColor(): string {
    return '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');

}


/**
 * TODO: Better ballanced colors to human eye
 */
