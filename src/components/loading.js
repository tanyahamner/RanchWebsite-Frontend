const Loading = (props) => {
    return (
      <div className="items-container" style={props.styles}>
        <div className="circle"></div>
        <h1>{props.content || "Loading..."}</h1>
      </div>
    );
  };
  
  export default Loading;
  