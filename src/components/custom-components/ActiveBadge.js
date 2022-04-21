export default function ActiveBadge(props) {
  return (
    <div className={props.active === true ? "badge badge-active" : "badge"}>
      {/* <i className="fas fa-square"></i> */}
      {props.active === true ? "True" : "False"}
    </div>
  );
}
