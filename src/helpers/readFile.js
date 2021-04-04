function handleFileSelection(input) {
  var file = input.files[0];
  console.log('file', file);
  if (file) {
    var reader = new FileReader();
    var fileName = file.name;
    waitForTextReadComplete(reader);
    reader.readAsText(file);
  }
}

function waitForTextReadComplete(reader) {
  reader.onloadend = function (event) {
    var text = event.target.result;

    console.log('xxx');
    parseTextAsXml(text);
  };
}

function parseTextAsXml(text) {
  var parser = new DOMParser();
  var xmlDom = parser.parseFromString(text, 'text/xml');

  //now, extract items from xmlDom and assign to appropriate text input fields
  /*var projectInfo = xmlDom.getElementsByTagName('ProjectInfo')[0];
    var title = projectInfo.getAttribute('Name');
    var validation = xmlDom.getElementsByTagName('ValidationCode');
    console.log('validation', validation);
    projectInfo.setAttribute('Name', 'E123456 **DATA Entry**');
    projectInfo.setAttribute('AnswerRequired', 'false');
  
    var filename = `${fileName.split('.xml')[0]}_DATA ENTRY.xml`;
    var pom = document.createElement('a');
  
    var s = new XMLSerializer();
    var str = s.serializeToString(xmlDom);
  
    var bb = new Blob([str], { type: 'text/plain' });
    pom.setAttribute('href', window.URL.createObjectURL(bb));
    pom.setAttribute('download', filename);
  
    pom.dataset.downloadurl = ['text/plain', pom.download, pom.href].join(':');
    pom.draggable = true;
    pom.classList.add('dragout');
  
    pom.click();*/
  console.log(xmlDom);
}

export default handleFileSelection;
