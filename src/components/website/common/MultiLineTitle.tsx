type MultiLineTitleProps = {
  lines: string[];
  className: string;
};

export function MultiLineTitle({ lines, className }: MultiLineTitleProps) {
  return lines.map((line) => (
    <span key={line} className={className}>
      {line}
    </span>
  ));
}
