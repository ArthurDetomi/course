const Notification = ({ data }) => {
  if (data === undefined || data === null) {
    return null;
  }

  return (
    <div className={data.isSuccess ? "success" : "error"}>{data.message}</div>
  );
};

export default Notification;
