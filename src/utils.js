export const STATUS = {
  IDLE: 'idle',
  PENDING: 'pending',
  RESOLVED: 'resolved',
  REJECTED: 'rejected',
};

export const xmlDomToBlob = (xmlDom) => {
  var xmlSerialize = new XMLSerializer();
  var xmlString = xmlSerialize.serializeToString(xmlDom);

  var blobXML = new Blob([xmlString], { type: 'text/plain' });
  return blobXML;
};

export const downloadXml = (xmlDom, filename) => {
  const blobXML = xmlDomToBlob(xmlDom);
  const downloadTag = document.createElement('a');
  const downloadURL = URL.createObjectURL(blobXML);
  downloadTag.setAttribute('href', downloadURL);
  downloadTag.setAttribute('download', filename);
  downloadTag.style.display = 'none';
  document.body.appendChild(downloadTag);

  downloadTag.click();
  URL.revokeObjectURL(downloadURL);
  document.body.removeChild(downloadTag);
};

function handleFileSelection(file, callback) {
  if (file) {
    var reader = new FileReader();
    waitForTextReadComplete(reader, callback);
    reader.readAsText(file);
  }
}

function waitForTextReadComplete(reader, callback) {
  reader.onloadend = function (event) {
    var text = event.target.result;
    parseTextAsXml(text);
    callback(text);
  };
}

export const parseTextAsXml = (text) => {
  var parser = new DOMParser();
  var xmlDom = parser.parseFromString(text, 'text/xml');
  return xmlDom;
};

export const generateOE = (eid, nameQ, text) => {
  const xmlString = `<Open EntityId="${eid}" NotPerformDataCleaningOnMasking="true">
                          <Name>${nameQ}</Name>
                          <FormTexts>
                            <FormText Language="12">
                              <Title>&amp;nbsp;</Title>
                              <Text>${text}</Text>
                              <Instruction />
                            </FormText>
                          </FormTexts>
                          <TranslationStatuses />
                          <QuestionTriggers />
                          <ValidationCode>if ( !f(CurrentForm()).toBoolean() ) { RaiseError(); SetQuestionErrorMessage(LangIDs.fr,"Veuillez fournir une r&#233;ponse.");}</ValidationCode>
                        </Open>`;
  const parser = new DOMParser();
  const $oe = parser.parseFromString(xmlString, 'text/xml').querySelector('*');

  return $oe;
};

export const generateNUM = (eid, nameQ, text, customAttr) => {
  const xmlString = `<Open EntityId="${eid}" NotRequired="true" QuestionCategory="" ${customAttr} DefaultValue="" NotPerformDataCleaningOnMasking="true" Rows="1" Numeric="true" LowerLimitType="GreaterOrEqual" UpperLimitType="SmallerOrEqual">
                      <Name>${nameQ}</Name>
                      <FormTexts><FormText Language="12"><Title>&amp;nbsp;</Title><Text>${text}</Text><Instruction /></FormText></FormTexts><TranslationStatuses />
                      <QuestionTriggers />
                      <ValidationCode>if ( !f(CurrentForm()).toBoolean() ) {RaiseError(); SetQuestionErrorMessage(LangIDs.fr,"Veuillez fournir une réponse."); }</ValidationCode>
                      </Open>`;
  const parser = new DOMParser();
  const $oe = parser.parseFromString(xmlString, 'text/xml').querySelector('*');

  return $oe;
};

export const precodeMask = (qid) => {
  const xmlString = `<PrecodeMask>nset(f("${qid}").toNumber())</PrecodeMask>`;
  const parser = new DOMParser();
  const $mask = parser
    .parseFromString(xmlString, 'text/xml')
    .querySelector('*');
  return $mask;
};

export const loopMask = (qid) => {
  const mask = `nset(f("${qid}").toNumber())`;
  return mask;
};

export const generateEntityId = (xmlDom, start, qTitle) => {
  let eid = 1700;
  if (start) {
    eid = start + 1;
  }
  let node;

  do {
    node = xmlDom.querySelector(`[EntityId="${eid}"]`);
    eid += 50;
  } while (node);
  return eid;
};

export const doesQuestionExists = (node, qTitle) => {
  if (node && node.querySelector('Name').innerHTML === qTitle) {
    return true;
  }
  return false;
};
export default handleFileSelection;
