import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const Loading = (props) => {
  return (
    <div className="items-container" style={props.styles}>
      <FontAwesomeIcon icon="fas fa-spinner" spin />
      <h1>{props.content || "Loading..."}</h1>
    </div>
  );
};

export default Loading;
