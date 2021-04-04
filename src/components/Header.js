// import { Image, Container } from '@chakra-ui/react';
import { Image } from '@chakra-ui/image';
import { Container } from '@chakra-ui/layout';
const Header = () => {
  return (
    <Container p={0} bgColor='#9895ba' maxW='80rem'>
      <Image src='https://aplusaresearch.sharepoint.com/_api/v2.1/drives/b!JSVGT39s40-yU2_QQg5Zalk6XfnFIehKvCYLoEg3l7bjrEQ5EgTTTqdyUkfi1Hqd/items/01JST7OF6I5RBC74BBGRA273TEDWEFDARW/thumbnails/0/c1600x99999/content?preferNoRedirect=true&prefer=extendCacheMaxAge&clientType=modernWebPart' />
    </Container>
  );
};

export default Header;
