import { isRouteErrorResponse, useRouteError } from 'react-router-dom';
import LinkButton from './LinkButton';

function Error() {
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
      <LinkButton to="-1">&larr; Go back</LinkButton>
    </div>
  );
}

export default Error;
