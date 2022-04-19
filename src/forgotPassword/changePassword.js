import Logo from "../img/logo.svg";

const ChangePassword = () => {
  return (
    <div className="fp-page-wrapper">
      <div className="forgot-password-wrapper">
        <div className="logo">
          <img src={Logo} alt="" height="32px"></img>
        </div>

        <div className="recovery-paper">
          <h2>Change Password</h2>

          <form className="recovery-form">
            <input
              required
              className="send-recovery"
              type="password"
              placeholder="New Password"
            />

            <input
              required
              className="send-recovery"
              type="password"
              placeholder="Re-enter Your New Password"
            />

            <button
              className="confirm-button send-recovery"
              type="submit"
              onClick={() => this.redirectTo(`/home`)}
            >
              Change Password
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ChangePassword;
