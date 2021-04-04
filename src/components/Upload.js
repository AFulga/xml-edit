import { Button } from '@chakra-ui/button';
import { Box, Container } from '@chakra-ui/layout';
import handleFileSelection from '../helpers/readFile';

const Upload = () => {
  const uploadHandler = () => {
    document.getElementById('uploadFile').click();
  };
  return (
    <Container
      mt={5}
      display='flex'
      flexDirection='row'
      justifyContent='center'
    >
      <input
        type='file'
        id='uploadFile'
        style={{ display: 'none' }}
        onChange={(event) => {
          handleFileSelection(event.target);
        }}
      />
      <Box mr={2} ml={2}>
        <Button colorScheme='blue' onClick={uploadHandler}>
          Upload
        </Button>
      </Box>
      <Box mr={2} ml={2}>
        <Button colorScheme='pink' onClick={uploadHandler}>
          Generate File
        </Button>
      </Box>
    </Container>
  );
};

export default Upload;
