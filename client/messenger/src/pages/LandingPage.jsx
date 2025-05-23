import Login from "./Login";
const LandingPage = () => {
  return (
    <div className="flex justify-center items-center bg-gray-100 min-h-screen gap-10">
      <section>
        <h1 className="text-blue-500 font-extrabold text-7xl mb-4">
          Messagely
        </h1>
        <p className="text-4xl max-w-md">
          Connect with friends and stay in touch with the world on Messagely.
        </p>
      </section>
      <div>
        <Login />
      </div>
    </div>
  );
};

export default LandingPage;
