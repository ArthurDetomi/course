const Notification = ({ message, isSuccess }) => {
  if (message == null) {
    return null;
  }

  const className = isSuccess ? "success" : "error";

  return <div className={className}>{message}</div>;
};

export default Notification;
