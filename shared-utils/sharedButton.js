// Shared styled button component
export function SharedButton(label = "Button", color = "#4f8cff") {
  const btn = document.createElement('button');
  btn.textContent = label;
  btn.style.background = color;
  btn.style.color = "#fff";
  btn.style.border = "none";
  btn.style.borderRadius = "12px";
  btn.style.padding = "0.7em 1.4em";
  btn.style.fontWeight = "bold";
  btn.style.fontSize = "1.1em";
  btn.style.margin = "0.7em 0";
  btn.style.boxShadow = "0 5px 12px -3px rgba(0,0,0,0.1)";
  btn.onpointerdown = () => btn.style.transform = "scale(0.96)";
  btn.onpointerup = () => btn.style.transform = "scale(1)";
  return btn;
}