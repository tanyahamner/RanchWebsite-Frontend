import Cookies from "js-cookie";
import useDeepEffect from "../../hooks/useDeepEffect";

const Home = (props) => {
  useDeepEffect(() => {
    let auth_token = Cookies.get("auth_token");

    if (!auth_token) {
      props.history.push("/login");
    }
  }, [props.history]);

  return (
    <div className="home-wrapper">
      <div>Welcome to Foundation</div>
    </div>
  );
};

export default Home;
