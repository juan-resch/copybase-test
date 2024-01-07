export default function getLabelFromDate(date: Date): string {
  const label = `${date.getMonth()}/${date.getFullYear()}`;

  return label;
}
