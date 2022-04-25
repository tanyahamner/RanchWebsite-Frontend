export default function ActiveBadge(props) {
  return (
    <div className={props.active === true ? "badge badge-active" : "badge"}>
      {/* <FontAwesomeIcon icon="fas fa-square" /> */}
      {props.active === true ? "True" : "False"}
    </div>
  );
}
