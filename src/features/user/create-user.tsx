import { type FormEvent, useState } from 'react';
import Button from '../../ui/button';
import { useAppDispatch } from '../../store';
import { updateName } from './user-slice';
import { useNavigate } from 'react-router-dom';

function CreateUser() {
  const [username, setUsername] = useState('');
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const name = username.trim();
    if (!name) return;

    dispatch(updateName(name));
    navigate("/menu", { viewTransition: true })
  }

  return (
    <form onSubmit={handleSubmit} className="mx-auto flex w-full max-w-md flex-col items-center gap-5">
      <label htmlFor="username" className="text-muted">
        Welcome! Tell us your name to start your order.
      </label>

      <input
        id="username"
        type="text"
        placeholder="Your full name"
        autoComplete="name"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        className="input w-full text-center"
      />

      <div className={`transition-all duration-300 ${username.trim() ? "translate-y-0 opacity-100" : "pointer-events-none -translate-y-1 opacity-0"}`}>
        <Button type="primary">Start ordering</Button>
      </div>
    </form>
  );
}

export default CreateUser;
