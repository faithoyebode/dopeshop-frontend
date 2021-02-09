export const decodeEntity = (encodedString) => {
    var span = document.createElement('span');
    span.innerHTML = encodedString;
    return span.innerHTML;
}