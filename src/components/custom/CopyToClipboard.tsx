import { BsCopy } from "react-icons/bs";

interface Props {
  handleCopy: (copiedText: string) => void;
  className?: string;
  text: string;
  top?: number;
  left?: number;
  bottom?: number;
  right?: number;
}
const CopyToClipboard = ({
  handleCopy,
  text,
  className,
  top,
  left,
  bottom,
  right,
}: Props) => {
  const topPostition = `top-${top}`;
  const leftPostition = `left-${left}`;
  const rightPostition = `right-${right}`;
  const bottomPostition = `bottom-${bottom}`;

  return (
    <span
      className={`${className} absolute  w-fit h-fit ${topPostition} ${leftPostition} ${rightPostition} ${bottomPostition} hover:bg-[#3e3e3e] cursor-pointer p-1 rounded-xl`}
      onClick={() => handleCopy(text)}
    >
      <BsCopy size={12} />
    </span>
  );
};

export default CopyToClipboard;
