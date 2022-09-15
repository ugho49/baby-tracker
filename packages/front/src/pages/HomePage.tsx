import { useSelector } from 'react-redux';
import { RootState } from '../core';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const mapState = (state: RootState) => ({ babies: state.baby.babies });

export const HomePage = () => {
  const { babies } = useSelector(mapState);
  const [babyid, setBabyId] = useState<string>();
  const navigate = useNavigate();

  const chooseBaby = () => {};

  return (
    <div>
      <span>Homepage</span>
      <select name="babies" value={babyid} onChange={(e) => setBabyId(e.target.value)}>
        <option disabled value="">
          Choisir un bébé
        </option>
        {(babies || []).map((baby) => (
          <option key={baby.id} value={baby.id}>
            {baby.firstname} {baby.lastname}
          </option>
        ))}
      </select>
      <button disabled={babyid === undefined} onClick={chooseBaby}>
        Choisir
      </button>
    </div>
  );
};
