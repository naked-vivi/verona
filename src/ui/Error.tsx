import { isRouteErrorResponse, useNavigate, useRouteError } from 'react-router-dom';

function Error() {
  const navigate = useNavigate();
  const error = useRouteError();

  return (
    <div>
      <h1>Something went wrong 😢</h1>

      {/* <p>{error.status}</p> */}
      {isRouteErrorResponse(error) ? (
        <>
          <p>Status: {error.status}</p>
          <p>{error.statusText}</p>
          <p>{error.data}</p>
        </>
      ) :
        <p>Unknown error</p>
      }

      <button onClick={() => navigate(-1)}>&larr; Go back</button>
    </div>
  );
}

export default Error;
