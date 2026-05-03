import Chart from "./chart";

const GenerativeComponent = ({ content }: { content: any }) => {
  return (
    <div>
      <Chart data={content.args} />
    </div>
  );
};

export default GenerativeComponent;
