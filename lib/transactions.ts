

function shortenHex(hex: string, length = 4) {
  return `${hex.substring(0, length + 2)}…${hex.substring(hex.length - length)}`;
}

export function truncateMiddle(input: string, offset = 5): string {
  if (!input) return '';
  // hashes
  if (input.startsWith('0x')) {
    return shortenHex(input, offset);
  }
  // for contracts
  if (input.includes('.')) {
    const parts = input.split('.');
    const start = parts[0]?.substring(0, offset);
    const end = parts[0]?.substring(parts[0].length - offset, parts[0].length);
    return `${start}…${end}.${parts[1]}`;
  }

  // for short inputs
  if (input.length <= 2 * offset) {
    return input;
  }

  // everything else
  const start = input?.substring(0, offset);
  const end = input?.substring(input.length - offset, input.length);
  return `${start}…${end}`;
}
