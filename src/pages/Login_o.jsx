import "../App.css";

function Login() {
  return (
    <div className="">
      <div className="container mx-auto h-[100vh] grid items-center">
        <div className="flex">
          <div className="w-1/2 text-white grid align-items-center">
            <div>
              <div>
                <img className="w-[250px]" src="images/logo-test.png" alt="" />
              </div>
              <div className="text-6xl font-semibold">Hello,</div>
              <div className="text-4xl font-semibold">
                Welcome to KPI Management System
              </div>
            </div>
            <div>
              please sign in to begin tracking your performance, reviewing your
              goals, <br /> and gaining valuable insights into your progress and
              achievements.
            </div>
          </div>
          <div className="w-1/2">
            <div className="bg-white rounded-[40px] h-[60vh] px-[15%] flex items-center">
              <form action="login" className="w-full">
                <div className="text-center text-4xl font-semibold mb-5">
                  Sign in
                </div>
                <label className="block mb-5">
                  <span className="block pb-2">Username</span>
                  <input className="w-full" type='username' />
                  <p className="mt-2 opacity-10 contrast-more:opacity-100 text-slate-600 text-sm"></p>
                </label>
                <label className="block">
                  <span className="block pb-2">Password</span>
                  <input className="w-full" type='password' />
                  <p className="mt-2 opacity-10 contrast-more:opacity-100 text-slate-600 text-sm"></p>
                </label>
                <div className="text-end mb-5">
                  <a className="text-maroon text-base" href="">
                    Forgot password ?
                  </a>
                </div>
                <button className="btn btn-submit-login w-full">Sign in</button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
