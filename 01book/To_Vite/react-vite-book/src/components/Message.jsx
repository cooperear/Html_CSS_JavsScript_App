const Message = ({ type, text }) => {
    if (!text) return null;
    return <div className={`message ${type}`}>{text}</div>;
};

export default Message;
