import { useEffect } from "react";
import Cookies from "js-cookie";

const Home = (props) => {
  useEffect(() => {
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
