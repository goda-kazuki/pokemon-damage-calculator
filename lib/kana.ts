export function toKatakana(input: string): string {
  return input.replace(/[\u3041-\u3096]/g, (match) => {
    const code = match.charCodeAt(0) + 0x60;
    return String.fromCharCode(code);
  });
}
