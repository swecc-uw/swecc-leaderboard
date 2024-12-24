import { ChevronDownIcon } from '@chakra-ui/icons';
import {
  MenuButton,
  Button,
  MenuList,
  MenuItem,
  Menu,
  Text,
} from '@chakra-ui/react';

export const OrderBySelect = ({
  value,
  onChange,
  options,
}: {
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
}) => {
  const buttonBg = 'white';
  const buttonBorder = 'gray.200';
  const menuBg = 'white';
  const menuBorder = 'gray.200';
  const menuHover = 'gray.50';

  const selectedOption = options.find((opt) => opt.value === value)?.label;

  return (
    <Menu placement="bottom-end">
      <MenuButton
        as={Button}
        rightIcon={<ChevronDownIcon />}
        bg={buttonBg}
        borderWidth="1px"
        borderColor={buttonBorder}
        borderRadius="lg"
        px={4}
        minW="180px"
        _hover={{ borderColor: 'blue.500' }}
        _active={{ bg: buttonBg }}
        transition="border-color 0.2s"
      >
        <Text noOfLines={1}>{selectedOption}</Text>
      </MenuButton>
      <MenuList
        bg={menuBg}
        borderColor={menuBorder}
        boxShadow="lg"
        borderRadius="md"
        overflow="hidden"
      >
        {options.map((option) => (
          <MenuItem
            key={option.value}
            onClick={() => onChange(option.value)}
            bg={value === option.value ? menuHover : 'transparent'}
            _hover={{ bg: menuHover }}
          >
            {option.label}
          </MenuItem>
        ))}
      </MenuList>
    </Menu>
  );
};
