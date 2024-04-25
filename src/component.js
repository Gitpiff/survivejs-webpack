export default (text = "Hello from component inside src") => {
    const element = document.createElement('div');
    element.innerHTML = text;
    return element
};
