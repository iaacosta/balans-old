import React from 'react';
import MovementButton from '../../components/MovementButton';

const Actions = () => {
  return (
    <>
      <MovementButton type="income" onPress={console.log} />
      <MovementButton type="expense" onPress={console.log} />
      <MovementButton type="transfer" onPress={console.log} />
      <MovementButton type="debt" onPress={console.log} />
      <MovementButton type="loan" onPress={console.log} />
    </>
  );
};

export default Actions;
