import {
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Text,
  Wrap,
  WrapItem,
} from '@chakra-ui/react';
import { useContext, useEffect } from 'react';
import { MyContext } from '../App';

function ModalWindow({ isModalOpen, toggleOpen, modalData }) {
  const { state, dispatch } = useContext(MyContext);
  useEffect(() => {
    if (modalData) {
      dispatch({ type: 'set_notEmpty', payload: null, group: modalData });
    }
  }, [modalData, dispatch]);
  if (!modalData) {
    return null;
  }

  const modalGroup = state.xmlUpdate.find((el) => el.group === modalData);
  const { group, toKeep, notEmpty } = modalGroup;

  const handleClick = (eid, shouldAdd) => {
    dispatch({
      type: 'set_toKeep',
      payload: { eid, shouldAdd },
      group: modalData,
    });
  };

  return (
    <>
      <Modal
        blockScrollOnMount={false}
        isOpen={isModalOpen}
        onClose={toggleOpen}
        size='2xl'
      >
        <ModalOverlay />
        <ModalContent pb='20px'>
          <ModalHeader>{group.toUpperCase()}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text fontWeight='bold' mb='1rem'>
              {`Select ${group} to keep`}
            </Text>
            <Wrap>
              {notEmpty.map((eid) => {
                const question = state.xmlDom.querySelector(
                  `[EntityId="${eid}"]`
                );
                const name = question.querySelector('Name').innerHTML;
                const isSelected = toKeep.includes(eid);
                return (
                  <WrapItem key={eid}>
                    <Button
                      variant={isSelected ? 'solid' : 'outline'}
                      colorScheme={isSelected ? 'green' : 'blue'}
                      onClick={() => handleClick(eid, !isSelected)}
                      width='94px'
                    >
                      {name}
                    </Button>
                  </WrapItem>
                );
              })}
            </Wrap>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}

export default ModalWindow;
