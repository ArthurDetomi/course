// eslint-disable-next-line react/prop-types
const Notification = ({ message }) => {
  const style = {
    border: "solid",
    padding: 10,
    borderWidth: 1,
    marginBottom: 5,
  };

  if (message === null || message === "") return null;

  return <div style={style}>{message}</div>;
};

export default Notification;
