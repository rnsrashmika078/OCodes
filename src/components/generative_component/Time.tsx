const Time = ({ content }: { content: any }) => {
  console.log("content", content);
  return <div>{content.name}</div>;
};

export default Time;
