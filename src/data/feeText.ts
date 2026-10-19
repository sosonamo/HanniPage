export function formatFee(amount: number): string {
  if (!Number.isSafeInteger(amount) || amount < 0) throw new Error('회비는 0 이상의 정수(원)로 입력하세요.');
  return `${amount.toLocaleString('ko-KR')}원`;
}

export function resolveFeeText(text: string, fees: { joining: number; monthly: number }): string {
  const replacements: Record<string, string> = {
    joiningFee: formatFee(fees.joining),
    monthlyFee: formatFee(fees.monthly),
  };
  return text.replace(/\{\{(\w+)\}\}/g, (_, key: string) => {
    if (!(key in replacements)) throw new Error(`알 수 없는 회비 표시 이름: ${key}`);
    return replacements[key];
  });
}
