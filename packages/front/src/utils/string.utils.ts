export function isBlank(str: string | undefined | null) {
  return !str || /^\s*$/.test(str);
}
