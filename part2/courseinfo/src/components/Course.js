import Header from "./Header";
import Content from "./Content";
import Total from "./Total";

const Course = ({ course }) => {
  const total = course.parts.reduce(
    (acc, currentValue) => acc + currentValue.exercises,
    0
  );

  return (
    <>
      <Header title={course.name} />

      <Content parts={course.parts} />

      <Total total={total} />
    </>
  );
};

export default Course;
