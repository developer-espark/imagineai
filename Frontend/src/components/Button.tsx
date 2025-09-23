import React from 'react';
import Loader from '../assets/Icon/Loader';

interface ButtonProps {
  loading: boolean;
}

const Button: React.FC<ButtonProps> = ({ loading }) => {
  return (
    <div>
      <button className="!bg-gray-200 !py-2 text-base text-gray-800 px-3 rounded-lg border border-gray-200 relative">
        {loading ? (<Loader />) : ('Submit')}
      </button>
    </div>
  );
}

export default Button;