import { Button } from '@chakra-ui/button';
import { SettingsIcon } from '@chakra-ui/icons';
import { Box } from '@chakra-ui/layout';
import { IconButton } from '@chakra-ui/react';

const OptionButton = ({
  label,
  buttonGroup,
  dispatch,
  ml,
  toggleModalOpen,
  isSelected,
}) => {
  const { group, showSettings, toKeep } = buttonGroup;
  const handleClick = () => {
    dispatch({ type: 'btn_selected', payload: !isSelected, group });
  };

  return (
    <>
      <Box mr={2} ml={2}>
        <Button
          variant={isSelected ? 'solid' : 'outline'}
          colorScheme={isSelected ? 'green' : 'blue'}
          onClick={handleClick}
          width='300px'
          ml={ml}
        >
          {label}
        </Button>
      </Box>
      {showSettings && (
        <IconButton
          onClick={() => toggleModalOpen(group)}
          variant={toKeep.length > 0 ? 'solid' : 'outline'}
          colorScheme={toKeep.length > 0 ? 'orange' : 'blue'}
          disabled={!isSelected}
          aria-label='Search database'
          icon={<SettingsIcon />}
        />
      )}
    </>
  );
};

export default OptionButton;
