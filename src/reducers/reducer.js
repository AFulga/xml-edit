import {
  generateEntityId,
  generateOE,
  generateNUM,
  precodeMask,
  loopMask,
} from '../utils';

export const reducer = (state, action) => {
  const { type, payload, group } = action;
  let selectedGroup;
  if (group) {
    selectedGroup = state.xmlUpdate.filter(
      (element) => element.group === group
    )[0];
  }

  switch (type) {
    case 'btn_selected': {
      return {
        ...state,
        xmlUpdate: [
          ...state.xmlUpdate.map((btn) => {
            if (btn.group === group) {
              btn.shouldUpdate = payload;
            }
            return btn;
          }),
        ],
      };
    }

    case 'set_xml':
      return { ...state, xmlDom: payload };

    case 'set_xmlText':
      return { ...state, xmlText: payload };

    case 'set_fileName':
      return { ...state, fileName: `clean_${payload}` };

    case 'clean_tag': {
      const { tagsToUpdate, toKeep, extraToKeep } = selectedGroup;
      const tagsSelected = Array.from(
        state.xmlDom.querySelectorAll(tagsToUpdate.toString())
      );

      const filterTags = tagsSelected.filter((tag) => {
        const eid = tag.parentNode.getAttribute('EntityId');
        return !toKeep.includes(+eid) && !extraToKeep.includes(+eid);
      });
      filterTags.forEach((tag) => {
        tag.innerHTML = '';
      });
      return { ...state };
    }
    case 'set_notEmpty': {
      const { tagsToUpdate, notEmpty } = selectedGroup;
      const tagsSelected = Array.from(
        state.xmlDom.querySelectorAll(tagsToUpdate.toString())
      );
      tagsSelected.forEach((tag) => {
        const varType = tag.parentNode.getAttribute('VariableType');
        const eid = tag.parentNode.getAttribute('EntityId');
        let isNotInQf = true;
        const closestIf = tag.closest('Condition');
        if (closestIf) {
          const expr = closestIf.querySelector('Expression');

          if (expr.innerHTML.indexOf('qf(') !== -1) {
            isNotInQf = false;
          }
        }
        if (
          varType !== 'Hidden' &&
          !notEmpty.includes(+eid) &&
          tag.innerHTML !== '' &&
          isNotInQf
        ) {
          notEmpty.push(+eid);
        }
      });
      return { ...state };
    }
    case 'set_toKeep': {
      let tempArr = selectedGroup.toKeep.slice();
      const { eid, shouldAdd } = payload;
      if (shouldAdd) {
        if (!tempArr.includes(eid)) {
          tempArr.push(eid);
        }
      } else {
        const index = tempArr.indexOf(eid);
        if (index >= 0) {
          tempArr = tempArr.filter((el) => el !== eid);
        }
      }
      return {
        ...state,
        xmlUpdate: [
          ...state.xmlUpdate.map((element) => {
            if (element.group !== group) {
              return element;
            }
            return { ...selectedGroup, toKeep: tempArr };
          }),
        ],
      };
    }
    case 'remove_attribute': {
      const { attrToRemove } = selectedGroup;

      attrToRemove.forEach((attr) => {
        const tagsSelected = state.xmlDom.querySelectorAll(`[${attr}]`);
        tagsSelected.forEach((tag) => {
          tag.removeAttribute(attr);
        });
      });
      return { ...state };
    }

    case 'add_attribute': {
      const { attrToAdd, tagsToUpdate, attrVal } = selectedGroup;
      tagsToUpdate.forEach((tagName, index) => {
        state.xmlDom.querySelectorAll(tagName).forEach((tag) => {
          tag.setAttribute(attrToAdd[index], attrVal[index]);
        });
      });
      return { ...state };
    }

    case 'add_title': {
      state.xmlDom.querySelectorAll('HtmlStyle').forEach(($tag) => {
        if ($tag.querySelector('Name').innerHTML === 'title') {
          const $leyout = $tag.querySelector('Layout');
          $leyout.setAttribute('Visibility', 'NotSet');
          $leyout.setAttribute('Display', 'NotSet');
        }
      });

      return { ...state };
    }

    case 'remove_screenig_cond': {
      const screenCallBlocksIDs = Array.from(
        state.xmlDom.querySelectorAll('CallableBlock > Name')
      )
        .filter((elem) => {
          return (
            elem.innerHTML === 'SOFT TERMINATE' ||
            elem.innerHTML === 'HARD TERMINATE'
          );
        })
        .map((node) => node.parentNode.getAttribute('EntityId'));

      screenCallBlocksIDs.forEach((eid) => {
        state.xmlDom
          .querySelectorAll(`[BlockToCallEntityId="${eid}"]`)
          .forEach((block) => {
            const $expr = block
              .closest('Condition')
              .querySelector('Expression');
            const text = $expr.innerHTML.trim();
            if (text.indexOf('false') !== 0) {
              $expr.innerHTML = `false // ${text}`;
            }
          });
      });
      return { ...state };
    }

    case 'remove_quotafull_cond': {
      state.xmlDom
        .querySelectorAll('Condition > Expression')
        .forEach((expr) => {
          if (expr.innerHTML) {
            const text = expr.innerHTML.trim();
            if (text.indexOf('qf(') === 0) {
              expr.innerHTML = `false // ${text}`;
            }
          }
        });
      return { ...state };
    }
    case 'remove_french_demographic_questions': {
      state.xmlDom.querySelectorAll('Page > Name').forEach((page) => {
        if (page.innerHTML) {
          const text = page.innerHTML.trim();
          if (text.indexOf('EndPageFrench') === 0) {
            const expr = page.closest('Condition').querySelector('Expression');
            const newText = expr.innerHTML.trim();
            if (newText.indexOf('false') !== 0) {
              expr.innerHTML = `false // ${newText}`;
            }
          }
        }
      });
      return { ...state };
    }

    case 'add_data_entry_questions': {
      const { questions } = selectedGroup;
      const validationGroup = state.xmlUpdate.filter(
        (el) => el.group === 'validations'
      )[0];

      let lastEid = null;
      questions.forEach((question) => {
        const { where, keepValidation, maskNodePoint } = question;
        let eid;
        if (true) {
          let nodePoints = [];
          if (typeof where.nodePoint === 'object') {
            const { parent, childName, childText } = where.nodePoint;
            nodePoints = Array.from(state.xmlDom.querySelectorAll(parent));

            nodePoints = nodePoints.filter(
              ($element) =>
                Array.from($element.children).filter(
                  (child) =>
                    child.nodeName === childName &&
                    child.innerHTML === childText
                ).length > 0
            );
          } else {
            nodePoints = Array.from(
              state.xmlDom.querySelectorAll(where.nodePoint)
            );
          }

          if (nodePoints.length === 0) {
            nodePoints = Array.from(
              state.xmlDom.querySelectorAll(where.nodePoint2)
            );
          }

          nodePoints.forEach((nodePoint, index) => {
            let parentNode = nodePoint.parentNode;
            eid = generateEntityId(state.xmlDom, lastEid, question.title);
            if (keepValidation) {
              validationGroup.extraToKeep.push(eid);
            }
            lastEid = eid;
            const qTitle = index
              ? question.title + (index + 1)
              : question.title;
            const questionXml = question.questionGenerate(
              eid,
              qTitle,
              question.text,
              question.customAttr
            );

            if (where.place === 'after') {
              nodePoint = nodePoint.nextSibling;
            }
            if (nodePoint.nodeName === 'Loop') {
              if (maskNodePoint) {
                const $lpMask = Array.from(nodePoint.children).filter(
                  (child) => child.nodeName === 'PrecodeMask'
                );
                if ($lpMask[0]) {
                  const mask = loopMask(qTitle);
                  $lpMask[0].innerHTML = mask;
                } else {
                  const $maskXml = precodeMask(qTitle);
                  nodePoint.appendChild($maskXml);
                }
              }

              if (where.place === 'prepand' || where.place === 'append') {
                parentNode = nodePoint.querySelector('Nodes');
              }
            }

            if (where.place === 'prepand') {
              nodePoint = parentNode.children[0];
            }

            const node = state.xmlDom.querySelector(`[EntityId="${eid}"]`);
            if (!node) {
              if (where.place === 'append') {
                parentNode.appendChild(questionXml);
              } else {
                parentNode.insertBefore(questionXml, nodePoint);
              }
            }
          });
        }
      });
      lastEid = null;

      return { ...state };
    }

    case 'append_data_entry': {
      const { tagsToUpdate, attrToChange } = selectedGroup;
      tagsToUpdate.forEach((tagName) => {
        const $tag = state.xmlDom.querySelector(tagName);
        const attrVal = $tag.getAttribute(attrToChange);
        if (attrVal.indexOf('DATA ENTRY') === -1) {
          $tag.setAttribute(
            attrToChange,
            `${attrVal.split(' *')[0]} **DATA ENTRY**`
          );
        }
      });

      return { ...state };
    }

    case 'set_ready_to_download': {
      return { ...state, readyToDownload: payload };
    }

    case 'reset_state':
      return { ...initialState };

    default:
      return { ...state };
  }
};

export const initialState = {
  xmlText: null,
  xmlDom: null,
  fileName: '',
  readyToDownload: false,
  xmlUpdate: [
    {
      group: 'validations',
      title: 'Remove all Validations',
      shouldUpdate: true,
      type: 'clean_tag',
      toKeep: [],
      extraToKeep: [],
      notEmpty: [],
      tagsToUpdate: ['ValidationCode'],
      showSettings: true,
    },
    {
      group: 'maskings',
      title: 'Remove all Maskings',
      shouldUpdate: true,
      type: 'clean_tag',
      toKeep: [],
      extraToKeep: [],
      notEmpty: [],
      tagsToUpdate: [
        'QuestionMask',
        'ScalePrecodeMask',
        'PrecodeMask',
        'ColumnMask',
      ],
      showSettings: true,
    },
    {
      group: 'triggers',
      title: 'Remove all Triggers',
      shouldUpdate: true,
      type: 'clean_tag',
      toKeep: [],
      extraToKeep: [],
      notEmpty: [],
      tagsToUpdate: ['QuestionTriggers'],
      showSettings: true,
    },
    {
      group: 'JavaScripts',
      title: 'Remove all JavaScripts code',
      shouldUpdate: true,
      type: 'clean_tag',
      extraToKeep: [],
      notEmpty: [],
      toKeep: [],
      tagsToUpdate: ['StartupScript'],
      showSettings: true,
    },
    {
      group: 'randomization',
      title: 'Remove all Rotation / Randomization',
      shouldUpdate: true,
      type: 'remove_attribute',
      toKeep: [],
      attrToRemove: [
        'AnswerlistOrder',
        'SubHeaderOrder',
        'ScaleOrder',
        'Randomize',
      ],
    },
    {
      group: 'notRequired',
      title: 'Make questions Not required',
      shouldUpdate: true,
      type: 'add_attribute',
      attrToAdd: ['AnswerRequired', 'RankOrder', 'AnswerRequiredType'],
      attrVal: ['false', 'false', 'NotRequired'],
      tagsToUpdate: ['ProjectInfo', 'ProjectInfo', 'Multi'],
    },
    {
      group: 'backButton',
      title: 'Add Back Button',
      shouldUpdate: true,
      type: 'add_attribute',
      attrToAdd: ['BackButton'],
      attrVal: ['true'],
      tagsToUpdate: ['ProjectInfo'],
    },
    {
      group: 'screening',
      title: 'Remove screening conditions',
      shouldUpdate: true,
      type: 'remove_screenig_cond',
      tagTextToUpdate: 'Expression',
    },
    {
      group: 'quotafull',
      title: 'Remove quotafull conditions',
      type: 'remove_quotafull_cond',
      shouldUpdate: true,
      tagTextToUpdate: 'Expression',
    },
    {
      group: 'changeName',
      title: 'Change name to DATA ENTRY',
      type: 'append_data_entry',
      shouldUpdate: true,
      attrToChange: 'Name',
      tagsToUpdate: ['ProjectInfo'],
    },
    {
      group: 'removeFrenchDemoQuestions',
      title: 'Remove French Demographic questions',
      type: 'remove_french_demographic_questions',
      shouldUpdate: true,
      tagTextToUpdate: 'Expression',
    },
    {
      group: 'addQuestionTitle',
      title: 'Add Question Title',
      shouldUpdate: true,
      type: 'add_title',
    },
    {
      group: 'addDataEntrySpecificQuestions',
      title: 'Add Data Entry Specific Questions',
      shouldUpdate: true,
      type: 'add_data_entry_questions',
      questions: [
        {
          title: 'IDMedecin',
          text: 'ID Medecin',
          where: {
            place: 'after',
            nodePoint: '[DirectiveType="ProgressbarBegin"]',
          },
          keepValidation: true,
          questionGenerate: generateOE,
        },
        {
          title: 'InitialOperator',
          text: 'Initals Operateur',
          where: {
            place: 'after',
            nodePoint: '[DirectiveType="ProgressbarBegin"]',
          },
          keepValidation: true,
          questionGenerate: generateOE,
        },
        {
          title: 'QuestionnaireComments',
          text: 'Questionnaire Comments',
          where: {
            place: 'before',
            nodePoint: {
              parent: 'Folder',
              childName: 'Name',
              childText: 'PV A+A End question',
            },
            nodePoint2: '[DirectiveType="ProgressbarEnd"]',
          },
          keepValidation: false,
          questionGenerate: generateOE,
        },
        {
          title: 'PatientCase',
          text: 'Patient Case',
          where: {
            place: 'before',
            nodePoint: 'Loop',
          },
          keepValidation: true,
          customAttr: 'LowerLimit="1" UpperLimit="14"',
          questionGenerate: generateNUM,
          maskNodePoint: true,
        },
        {
          title: 'PatientLogin',
          text: 'Patient Login',
          where: {
            place: 'prepand',
            nodePoint: 'Loop',
          },
          keepValidation: true,
          customAttr: 'Precision="6"',
          questionGenerate: generateNUM,
        },
        {
          title: 'PatientComments',
          text: 'Patient Comments',
          where: {
            place: 'append',
            nodePoint: 'Loop',
          },
          keepValidation: false,
          questionGenerate: generateOE,
        },
      ],
    },
  ],
};