function buildShareUrl(result) {
  const text = [
    `私の結果は「${result.typeName}」でした`,
    `${result.typeCode}`,
    ``,
    `M度 ${result.m}`,
    `S度 ${result.s}`,
    `称号：${result.title}`,
    `ランク：${result.rank}`,
    result.awakening ? `覚醒：${result.awakening}` : "",
    ``,
    `#SMタイプ診断`
  ].filter(Boolean).join("\n");

  const url = location.origin + location.pathname.replace("result.html", "index.html");
  return `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
}
