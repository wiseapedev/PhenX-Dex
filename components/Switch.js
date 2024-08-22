import React, {useState} from 'react';
import Switch from 'react-switch';

const ToggleSwitch = ({text}) => {
  const [isEnabled, setIsEnabled] = useState(false);

  const handleToggle = (checked) => {
    setIsEnabled(checked);
  };

  return (
    <div className='switch-item-container'>
      <div className='small-text'>{text}</div>
      <Switch
        className='toggle-switch'
        onChange={handleToggle}
        checked={isEnabled}
        offColor='#1b1b1b'
        onColor='#ffa500'
        handleDiameter={6}
        height={16}
        width={45}
        uncheckedIcon={false}
        checkedIcon={false}
      />
    </div>
  );
};

export default ToggleSwitch;
