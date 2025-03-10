import Part from "./Part";

const Content = (props) => {
  return (
    <div>
      <Part part={props.data[0].part} exercises={props.data[0].exercises} />
      <Part part={props.data[1].part} exercises={props.data[1].exercises} />
      <Part part={props.data[2].part} exercises={props.data[2].exercises} />
    </div>
  );
};

export default Content;
